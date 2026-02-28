import { BeautifyCanvas } from './components/Canvas/BeautifyCanvas';
import { DropZone } from './components/Canvas/DropZone';
import { Toolbar } from './components/Toolbar/Toolbar';
import { TopBar } from './components/Sidebar/TopBar';
import { useStore } from './stores/useStore';

function App() {
  const sourceImage = useStore((s) => s.sourceImage);

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden select-none">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          <DropZone />
          <BeautifyCanvas />
        </div>
        {sourceImage && <Toolbar />}
      </div>
    </div>
  );
}

export default App;
