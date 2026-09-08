import { render } from 'preact';
import { App } from './app';

const root = document.createElement('div');
document.body.append(root);
render(<App />, root);
