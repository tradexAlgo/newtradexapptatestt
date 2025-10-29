
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { createRoot } from 'react-dom/client';

const rootTag = document.getElementById('root');
AppRegistry.registerComponent(appName, () => App);
const { element } = AppRegistry.getApplication(appName);
createRoot(rootTag).render(element);
