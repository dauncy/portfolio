import './style.css';
import { shockWave } from './services/shock-wave.service';
import { contactService } from './services/contact.service';

export const main = () => {
  shockWave.init();
  contactService.init();
}
