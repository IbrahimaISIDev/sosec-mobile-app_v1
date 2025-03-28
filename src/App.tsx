import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { OfflineProvider } from './contexts/OfflineContext';
import { SyncProvider } from './contexts/SyncContext';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <OfflineProvider>
        <SyncProvider>
          <AppNavigator />
        </SyncProvider>
      </OfflineProvider>
    </AuthProvider>
  );
};

export default App;


// import React from 'react';
// import { AuthProvider } from './contexts/AuthContext';
// import LoginScreen from './screens/auth/LoginScreen';

// const App: React.FC = () => {
//   return (
//     <AuthProvider>
//       <LoginScreen />
//     </AuthProvider>
//   );
// };

// export default App;