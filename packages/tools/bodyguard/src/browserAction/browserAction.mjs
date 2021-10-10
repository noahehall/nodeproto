import ReactDOM from 'react-dom';
import { getSidebarAction, getRuntime } from '../shared/utils';

const sidebarAction = getSidebarAction();
const runtime = getRuntime();

function BodyguardBrowserActions () {
  return (
    <main>
      <h1>Bodyguard Actions</h1>
      <ul css={{ 'list-style': 'none'}}>
        <li><a href="#" onClick={() => sidebarAction.toggle()}>Toggle Sidebar</a></li>
        <li><a href="#" onClick={() => runtime.openOptionsPage()}>Bodyguard Preferences and Options</a></li>
      </ul>
    </main>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<BodyguardBrowserActions />);
