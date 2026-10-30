import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { InstallerWizard } from './components/Installer/InstallerWizard';
import { Desktop } from './components/Desktop/Desktop';
import { BootScreen } from './components/System/BootScreen';
import { LockScreen } from './components/System/LockScreen';
import { ShutdownScreen } from './components/System/ShutdownScreen';

const OSContainer: React.FC = () => {
  const { osState } = useOS();

  switch (osState) {
    case 'installer':
    case 'installing':
      return <InstallerWizard />;
    case 'booting':
      return <BootScreen />;
    case 'lockscreen':
      return <LockScreen />;
    case 'shutdown':
      return <ShutdownScreen />;
    case 'desktop':
    default:
      return <Desktop />;
  }
};

export default function App() {
  return (
    <OSProvider>
      <div className="w-full h-full select-none overflow-hidden font-sans">
        <OSContainer />
      </div>
    </OSProvider>
  );
}
