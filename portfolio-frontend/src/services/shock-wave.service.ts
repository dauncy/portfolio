import anime from 'animejs';

const GRID_WIDTH = 54;
const GRID_HEIGHT = 19;

class ShockWave {
  private readonly _gridHeight = GRID_HEIGHT;
  private readonly _gridWidth = GRID_WIDTH;

  private grid: HTMLDivElement[] = [];

  public init = () => {
    const gridContainer: HTMLDivElement | null = document.getElementById('shockwave-grid') as (HTMLDivElement | null);
    if (!gridContainer) {
      return;
    }
    gridContainer.style.setProperty('--shockwave-grid-width', `${this._gridWidth}`);
    this.createGrid();
    for (const child of this.grid) {
      gridContainer.appendChild(child);
    }

    setTimeout(() => {
      const random = Math.floor(Math.random() * 5);
      const autoClick = this.grid[random];
      const click = new Event('click');
      autoClick.dispatchEvent(click);
    }, 50);
  }

  private handleCellClick = ({ cell }: { cell: HTMLDivElement }) => {
    const idx = cell.dataset.gridIdx;
    if (!idx) {
      return;
    }

    anime({
      targets: '.shockwave-point',
      background: [
        {
          value: '#c084fc',
          easing: 'easeOutSine',
          duration: 250
        },
        {
          value: 'linear-gradient(to bottom right, #334155, #94a3b8 )',
          easing: 'easeInOutQuad',
          duration: 500,
        }
      ],
      scale: [
        {
          value: 1.35,
          easing: 'easeOutSine',
          duration: 250
        },
        {
          value: 1,
          easing: 'easeInOutQuad',
          duration: 500
        }
      ],
      translateY: [
        {
          value: -30,
          easing: 'easeOutSine',
          duration: 250
        },
        {
          value: 0,
          easing: 'easeInOutQuad',
          duration: 500
        }
      ],
      opacity: [
        {
          value: 1,
          easing: 'easeOutSine',
          duration: 250
        },
        {
          value: 0.5,
          easing: 'easeInOutQuad',
          duration: 500
        }
      ],
      
      delay: anime.stagger(100, {
        grid: [this._gridWidth, this._gridHeight],
        from: parseInt(idx),
      })
    })
  }

  private createCell = ({ idx }: { idx: number }) => {
    const dot = document.createElement('div');
    dot.classList.add('shockwave-dot');
    dot.dataset.gridIdx = `${idx}`;

    const point = document.createElement('div');
    point.classList.add('shockwave-point')
    point.dataset.gridIdx = `${idx}`;

    dot.appendChild(point);

    dot.addEventListener('click' , () => {
      this.handleCellClick({ cell: dot });
    })
    return dot;
  }

  private createGrid = () => {
    this.grid = Array.from(new Array(this._gridWidth * this._gridHeight)).map((_, i)=> {
      const cell = this.createCell({ idx: i});
      return cell;
    })
  }
}

export const shockWave = new ShockWave();