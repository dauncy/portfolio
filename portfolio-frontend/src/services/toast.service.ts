import { Nullable } from "../types";
import { Icons } from "../UI/Icons";
import { sleep } from "../utils/async.utils";

interface ToastOptions {
  autoClose?: number
}

const ANIMATION_TIME_IN_MS = 300;


class ToastService {
  static instance: ToastService
  private _toastEl: Nullable<HTMLDivElement> = null;
  private _animationEl: Nullable<HTMLDivElement> = null;
  private autoClose = 3000;

  static getInstance() {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  constructor() {}

  public toast = async (message: string, options?: ToastOptions) => {
    await this.dispose();
    this.autoClose = options?.autoClose ?? 3000;
    this.createToast({ text: message });
  }

  private createToast = ({ text }: { text: string }) => {
    const parent = document.createElement('div');
    parent.classList.add('toast-container')
    const container = document.createElement('div');
    container.classList.add('toast');
    container.classList.add('slide-in')
    const textEl = document.createElement('p');
    textEl.innerText = text;
    const icon = Icons.Success();
    container.appendChild(icon);
    container.appendChild(textEl);
    parent.appendChild(container);
    this._animationEl = container;
    this._toastEl = parent;
    document.body.appendChild(this._toastEl);

    this.dispose();
  }

  public dispose = async () => {
    if (!this._toastEl || !this._animationEl) {
      return;
    }
    

    await sleep(this.autoClose);
    this._animationEl.classList.remove('slide-in');
    this._animationEl.classList.add('slide-out');
    await sleep(ANIMATION_TIME_IN_MS);
    
  
    Array.from(this._toastEl.children).forEach((child) => {
      this._toastEl?.removeChild(child);
    });

    document.body.removeChild(this._toastEl);
    this._toastEl = null;
  }
}

export const toastService = ToastService.getInstance();
