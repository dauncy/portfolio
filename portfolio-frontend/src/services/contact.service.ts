import { Nullable } from "../types";
import { z, ZodError } from 'zod';
const errorSVG = '/images/error.svg';

const contactSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  email: z.string().email(),
  message: z.string().min(3)
});

type ContactForm = z.infer<typeof contactSchema>;
type FormKey = 'email' | 'name' | 'message';
type FormEl = HTMLInputElement | HTMLTextAreaElement;

const DATA_IDS: FormKey[] = [
  'name',
  'email',
  'message',
];

const getFormKey = ({ el }: { el: Element }): Nullable<FormKey> => {
  const attribute = el.getAttribute('data-id');
  return DATA_IDS.find((id): id is FormKey => id === attribute) ?? null;
}

class ContactService {
  private _form: Nullable<HTMLFormElement> = null;
  private _errorEl: Nullable<HTMLElement> = null;

  private sendContactMessage = async (formData: ContactForm) => {
    // TODO Post to backend
    return formData
  }

  private handleError = ({ message }: { message: string }) => {
    if (!this._form) {
      return;
    }

    this.disposeError();
    const div = document.createElement('div');
    div.classList.add('error')
    const icon = document.createElement('img')
    icon.classList.add('error');
    icon.src= errorSVG;
    div.appendChild(icon)
    const p = document.createElement('p');
    p.innerText = `${message}`;
    div.append(p)
    this._errorEl = div;
    this._form.prepend(div);
  };

  private disposeError = () => {
    if (!this._errorEl) {
      return;
    }
    this._form?.removeChild(this._errorEl);
  };

  private getFormData = () => {
    if (!this._form) {
      return;
    }

    const data: ContactForm  = {
      name: '',
      email: '',
      message: '',
    } 

    const inputs = Array.from(this._form.elements).filter((el): el is FormEl => getFormKey({ el }) !== null);
    for (const input of inputs) {
      const key = getFormKey({ el: input });
      const value = input.value;
      if (!key) {
        continue;
      }
      data[key] = value;
    }
    try {
      const sanitized = contactSchema.parse(data);
      return sanitized;
    } catch (e: unknown) {
      const errors = (e as ZodError).errors;
      const first = errors[0]?.message;
      this.handleError({ message: first })
    }
    
  };

  private subscribeToSubmit = () => {
    if (!this._form) {
      return;
    }

    this._form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.disposeError();

      const formData = this.getFormData();
      if (!formData) {
        return;
      }
      await this.sendContactMessage(formData);

      this._form?.reset();
    })
  };

  public init = () => {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form) {
      return;
    }
    this._form = form;
    this.subscribeToSubmit();
  };
}

export const contactService = new ContactService();