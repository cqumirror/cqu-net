const CC_LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans';

export function renderSiteFooter() {
  return `
    <footer class="site-footer">
      <p class="site-copyright">© 2026 重庆大学蓝盟  Lanunion</p>
      <p class="site-license">文档文件的分发遵循 <a href="${CC_LICENSE_URL}" target="_blank" rel="license noopener noreferrer">CC BY-NC-SA 4.0</a> 许可协议。</p>
    </footer>`;
}
