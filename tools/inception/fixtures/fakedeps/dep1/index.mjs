import dep2 from 'dep2';
import './added/something.js'

dep2();


export default () => {
  console.log('\n\n runninkkg dep2', dep2);
}