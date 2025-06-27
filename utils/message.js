// 简单的消息提示系统
class MessageSystem {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document !== 'undefined') {
      this.container = document.getElementById('message-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'message-container';
        this.container.className = 'message-container';
        document.body.appendChild(this.container);
      }
    }
  }

  show(content, type = 'info', duration = 3000) {
    if (!this.container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    
    // 添加图标
    const icon = this.getIcon(type);
    if (icon) {
      messageEl.innerHTML = `${icon} <span>${content}</span>`;
    } else {
      messageEl.textContent = content;
    }

    this.container.appendChild(messageEl);

    // 自动移除
    setTimeout(() => {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        this.container.removeChild(messageEl);
      }, 300);
    }, duration);
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || '';
  }

  success(content, duration) {
    this.show(content, 'success', duration);
  }

  error(content, duration) {
    this.show(content, 'error', duration);
  }

  warning(content, duration) {
    this.show(content, 'warning', duration);
  }
}

// 创建全局实例
const message = new MessageSystem();

export default message;