import { Nullable } from "../types";
import { z, ZodError } from 'zod';
import { authService } from "./auth.service";
import { toastService } from "./toast.service";

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
  private _loadingEl: Nullable<HTMLElement> = null;
  private loading = false;

  private sendContactMessage = async (formData: ContactForm) => {
    const url = `${BACKEND_URL}/emails/reachOut`;
    const headers = authService.getDefaultHeaders();
    const body = JSON.stringify(formData);

    try {
      const res = await fetch(url,{
        method: 'POST',
        headers,
        body,
      });
      if (res.ok === false) {
        throw new Error('bad fetch');
      }
      const data = await res.json();
      return data;
    } catch (e) {
      this.handleError({ message: 'Message failed to send' });
    }
  }

  private handleError = ({ message }: { message: string }) => {
    if (!this._errorEl) {
      return;
    }

    const p = this._errorEl.querySelector('p');
    if (p) {
      p.innerText = message;
    }

    this._errorEl.dataset.error = 'true';
  };

  private handleLoading = ({ loading }: { loading: boolean }) => {
    this.loading = loading;
    if (!this._loadingEl || !this._form) {
      return;
    }

    this._loadingEl.dataset.loading = `${loading}`;
    this._form.dataset.disabled = `${loading}`;
  };

  private disposeError = () => {
    if (!this._errorEl) {
      return;
    }
    const p = this._errorEl.querySelector('p');
    if (p) {
      p.innerText = ''
    }

    this._errorEl.dataset.error = 'false';

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
      if (this.loading) {
        return;
      }
      this.handleLoading({ loading: true });
      this.disposeError();

      const formData = this.getFormData();
      if (!formData) {
        this.handleLoading({ loading: false });
        return;
      }
      const data = await this.sendContactMessage(formData);
      if (data && data?.status && data.status === 200) {
        toastService.toast('Message sent successfully!');
      }
      this._form?.reset();
      this.handleLoading({ loading: false });
    })
  };

  public init = () => {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    const errorDiv = document.getElementById('form-error') as HTMLDivElement;
    const button = document.getElementById('contact-submit');
    if (!form || !errorDiv || !button) {
      return;
    }
    this._form = form;
    this._errorEl = errorDiv;
    this._loadingEl = button;
    this.subscribeToSubmit();
  };
}

export const contactService = new ContactService();