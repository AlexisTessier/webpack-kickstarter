import UIComponent from '@alexistessier/ui-component'

class App extends UIComponent{
}

App.cssClass = 'App';
App.renderMethod = require('./App.pug');

export default App;