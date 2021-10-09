import ReactDOM from 'react-dom';

function BodyguardBrowserActions () {
  return (
    <main>
      <h1>Bodyguard Actions</h1>
      <p>TODO</p>
      <p><a href="#">Toggle Sidebar</a></p>
      <p><a href="#">Extension Options</a></p>
    </main>
  )
}
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<BodyguardBrowserActions />);
