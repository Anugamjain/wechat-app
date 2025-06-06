import { useRef, useEffect, useCallback } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import socketInit from "../sockets/index";
import { ACTIONS } from "../actions";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const rtcConnections = useRef({});
  const localMediaStream = useRef(null);
  const socketRef = useRef(null);
  const clientsRef = useRef(null);
  const remoteDescriptionRef = useRef({});
  const flag = useRef({}); // flag array for re-updating the remote session description
  const isMutedRef = useRef(true); // default: muted on join

  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((prev) => {
        const exists = prev.find((client) => client.id === newClient.id);
        if (!exists) return [...prev, newClient];
        return prev;
      }, cb);
    },
    [setClients]
  );

  const startCapture = useCallback(async () => {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      },[]);

  // Capture the local media stream (your device audio) and make this audio as source to your (only your) audio element at the room page
  const handleNewPeer = useCallback(async ({ peerId, createOffer, user: remoteUser }) => {

        console.log('handle new peer called by peerId:', peerId);
        console.log('before', rtcConnections.current[peerId]);
        if (peerId in rtcConnections.current) {
          console.warn(
            "you are already connected with ",
            peerId,
            remoteUser.name
          );
          return;
        }

        // Add socketId of this peer into our rtcConnections.current and open a new RTC connection
        rtcConnections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        console.log('after', rtcConnections.current[peerId]);

        // Handle new ice candidates
        rtcConnections.current[peerId].onicecandidate = (event) => {
          socketRef.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        };

        // Handle on track of this connection
        rtcConnections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            const audioElement = audioElements.current[remoteUser.id];
            if (audioElement) {
              audioElement.srcObject = remoteStream;
              // audioElement.muted = true;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream;
                  // audioElements.current[remoteUser.id].muted = true;
                  settled = true;
                }
                if (settled) {
                  clearInterval(interval);
                }
              }, 1000);
            }
          });
        };

        // Add local track to remote rtcConnections.current
        localMediaStream.current.getTracks().forEach((track) => {
          rtcConnections.current[peerId].addTrack(track, localMediaStream.current);
        });

        // Create Offer
        if (createOffer) {
          const offer = await rtcConnections.current[peerId].createOffer();

          await rtcConnections.current[peerId].setLocalDescription(offer);

          // send offer to another client
          socketRef.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      }, []);

  const handleRemovePeer = useCallback(async ({ peerId, userId }) => {
        console.log('handle remove peer called by peerId:', peerId);
        if (rtcConnections.current[peerId]) {
          rtcConnections.current[peerId].close();
        }
        delete rtcConnections.current[peerId];
        delete audioElements.current[peerId];
        setClients((list) => list.filter((client) => client.id !== userId));
      }, []);

  const handleIceCandidate = useCallback(async ({ peerId, icecandidate }) => {
        if (icecandidate) {
          rtcConnections.current[peerId].addIceCandidate(icecandidate);
        }
      }, []);

  const handleRemoteSDP = useCallback(async ({ peerId, sessionDescription: remoteSessionDescription}) => {
        const connection = rtcConnections.current[peerId];

        if (peerId in flag) return;
        flag[peerId] = true;

        // Prevent duplicate setting
        if (!connection || peerId in remoteDescriptionRef.current) {
          console.log(connection);
          console.warn(
            `Skipping SDP set for ${peerId}, signalingState: ${connection?.signalingState}`
          );
          return;
        }

        console.log('setting session description1');
        await connection.setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );
        
        remoteDescriptionRef.current[peerId] = true;
        // if session description is an offer, then generate an answer
        if (remoteSessionDescription.type === "offer") {
          
          const answer = await connection.createAnswer();

          await connection.setLocalDescription(answer);
          console.log('setting session description2');
          socketRef.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }, []);
  
  const handleSetMute = useCallback(async (mute, userId) => {
        console.log("mute request received for user ", userId);

        // Clone the current clients array and update the target client
        let updatedClients = clientsRef.current.map((client) =>
          client.id === userId ? { ...client, muted: mute } : client
        );

        updatedClients = JSON.parse(JSON.stringify(updatedClients));
        // console.log(clientsRef.current, updatedClients);

        audioElements.current[userId].muted = mute;

        // Update both ref and state
        clientsRef.current = updatedClients;
        setClients(updatedClients);
      }, []);

  // Initialise clientsRef
  useEffect(() => {
    clientsRef.current = clients;
    return () => {
      clientsRef.current = null;
    };
  }, [clients]);

  useEffect(() => {
    console.log('all rtcConnections', rtcConnections.current);

    async function init() {
      socketRef.current = socketInit();
      socketRef.current.auth = {user};
      socketRef.current.connect();

      await startCapture();
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
          // localElement.muted = true;
        }
        socketRef.current.emit(ACTIONS.JOIN, { roomId, user });
      });

      socketRef.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socketRef.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socketRef.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socketRef.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);
      socketRef.current.on(ACTIONS.MUTE, ({ userId }) => {
        handleSetMute(true, userId);
      });
      socketRef.current.on(ACTIONS.UN_MUTE, ({ userId }) => {
        handleSetMute(false, userId);
      });
    }

    init();

    return () => {
      // leaving the room
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      socketRef.current.emit(ACTIONS.LEAVE, { roomId });
      // socketRef.current.disconnect(); // <-- Add this¸¸¸

      socketRef.current.off(ACTIONS.ADD_PEER);
      socketRef.current.off(ACTIONS.REMOVE_PEER);
      socketRef.current.off(ACTIONS.ICE_CANDIDATE);
      socketRef.current.off(ACTIONS.SESSION_DESCRIPTION);
      socketRef.current.off(ACTIONS.MUTE);
      socketRef.current.off(ACTIONS.UN_MUTE);
      console.log("closing all Connections");
      for (let peerId in rtcConnections.current) {
        rtcConnections.current[peerId].close();
        delete rtcConnections.current[peerId];
      }
      for (let userId in audioElements.current.current) {
        delete audioElements.current.current[userId];
      }
    };
  }, []);

  // Handling mute and unmute of speakers
  const handleMute = (isMute) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = isMute;
        console.log("mute req emitted");
        if (isMute) {
          socketRef.current.emit(ACTIONS.MUTE, { roomId, userId: user.id });
        } else {
          socketRef.current.emit(ACTIONS.UN_MUTE, { roomId, userId: user.id });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  // Add new Audio instances to AudioRef
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  return { clients, provideRef, handleMute };
};


