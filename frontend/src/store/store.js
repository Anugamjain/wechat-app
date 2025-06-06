// store.js
import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice";
import activate from "./activationSlice";
import { combineReducers } from "redux";

// Combine your slices
const rootReducer = combineReducers({
  auth,
  activate,
});

// Configure store
const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export default store;



// Persiatent Storage
// import { configureStore } from "@reduxjs/toolkit";
// import auth from "./authSlice";
// import activate from "./activationSlice";

// // Add these imports for redux-persist
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // localStorage by default
// import { combineReducers } from "redux";

// // Combine your slices first
// const rootReducer = combineReducers({
//   auth,
//   activate,
// });

// // persist configuration
// const persistConfig = {
//   key: "root",
//   storage,
// };

// // Create a persisted reducer
// const persistedReducer = persistReducer(persistConfig, rootReducer);

// // Configure store with persisted reducer
// const store = configureStore({
//   reducer: persistedReducer,
//   devTools: true,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore redux-persist action types
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// // Create persistor
// export const persistor = persistStore(store);

// export default store;
