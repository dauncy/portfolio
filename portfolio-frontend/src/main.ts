
import { shockWave } from './services/shock-wave.service';
import { contactService } from './services/contact.service';
import './style.css'
import { getBackendURL } from './utils/platform.utils';

export const main = () => {
  getBackendURL();
  shockWave.init();
  contactService.init();
}
