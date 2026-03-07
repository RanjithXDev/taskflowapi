function fadeIn(element, duration = 400) {
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-in`;

  setTimeout(() => {
    element.style.opacity = '1';
  }, 10);

  return new Promise(resolve => setTimeout(resolve, duration));
}


function slideIn(element, duration = 400, direction = 'up') {
  const offsets = {
    'up': { from: 20, to: 0 },
    'down': { from: -20, to: 0 },
    'left': { from: 20, to: 0 },
    'right': { from: -20, to: 0 }
  };

  const offset = offsets[direction] || offsets['up'];

  element.style.opacity = '0';
  element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  if (direction === 'up' || direction === 'down') {
    element.style.transform = `translateY(${offset.from}px)`;
  } else {
    element.style.transform = `translateX(${offset.from}px)`;
  }

  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = `translate(0, 0)`;
  }, 10);

  return new Promise(resolve => setTimeout(resolve, duration));
}


function addClickAnimation(element) {
  element.addEventListener('mousedown', function() {
    this.style.transform = 'scale(0.95)';
    this.style.transition = 'transform 0.1s ease';
  });

  element.addEventListener('mouseup', function() {
    this.style.transform = 'scale(1)';
  });

  element.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
}


function addHoverLift(element) {
  element.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px)';
    this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
  });

  element.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '';
  });
}


function shake(element, duration = 400) {
  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(5px)' },
    { transform: 'translateX(-5px)' },
    { transform: 'translateX(0)' }
  ];

  element.animate(keyframes, {
    duration: duration,
    easing: 'ease-in-out'
  });
}


function pulse(element) {
  const keyframes = [
    { opacity: 0.6 },
    { opacity: 1 },
    { opacity: 0.6 }
  ];

  element.animate(keyframes, {
    duration: 1500,
    iterations: Infinity,
    easing: 'ease-in-out'
  });
}


function createLoadingSpinner(message = 'Loading...') {
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  spinner.innerHTML = `
    <div class="spinner-inner"></div>
    <p>${message}</p>
  `;
  spinner.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 30px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  `;

  const innerSpinner = spinner.querySelector('.spinner-inner');
  innerSpinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;

  return spinner;
}


function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  const colors = {
    'success': { bg: '#28a745', text: 'white' },
    'error': { bg: '#dc3545', text: 'white' },
    'warning': { bg: '#ffc107', text: 'black' },
    'info': { bg: '#17a2b8', text: 'white' }
  };

  const color = colors[type] || colors['info'];

  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${color.bg};
    color: ${color.text};
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    font-weight: 500;
    z-index: 9999;
    animation: slideInUp 0.3s ease;
    max-width: 400px;
  `;

  toast.textContent = message;
  document.body.appendChild(toast);

  if (duration > 0) {
    setTimeout(() => {
      toast.style.animation = 'slideOutDown 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  return toast;
}


function showConfirmDialog(message, onConfirm, onCancel) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    animation: slideInUp 0.3s ease;
  `;

  dialog.innerHTML = `
    <p style="margin: 0 0 20px 0; font-size: 1.1rem; color: #2c3e50;">${message}</p>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button id="cancelBtn" style="
        padding: 10px 20px;
        background: #e9ecef;
        color: #333;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Cancel</button>
      <button id="confirmBtn" style="
        padding: 10px 20px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
      ">Confirm</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  dialog.querySelector('#confirmBtn').addEventListener('click', () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  });

  dialog.querySelector('#cancelBtn').addEventListener('click', () => {
    overlay.remove();
    if (onCancel) onCancel();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      if (onCancel) onCancel();
    }
  });
}


function smoothScroll(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}


function setButtonLoading(button, isLoading = true) {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = '...';
    button.style.opacity = '0.7';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
    button.style.opacity = '1';
  }
}


function initializeAnimations() {
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideOutDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.6;
        }
      }

      .smooth-transition {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
  initializeAnimations();
}
