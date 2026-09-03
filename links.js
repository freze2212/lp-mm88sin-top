/**
 * Xử lý sự kiện click chuyển hướng theo domain config
 */
function checklinkvn() {
    var url = window.REDIRECT_URL || (window.SITE_CONFIG && window.SITE_CONFIG.registerUrl) || 'https://mm88e9e23qc.mm2188.com/register.html';
    window.location.href = url;
}

// Lắng nghe khi domainConfigLoaded được kích hoạt
window.addEventListener('domainConfigLoaded', function (e) {
    if (e.detail && e.detail.url) {
        document.querySelectorAll('.register-link').forEach(function (el) {
            el.href = e.detail.url;
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var url = window.REDIRECT_URL || (window.SITE_CONFIG && window.SITE_CONFIG.registerUrl);
    if (url) {
        document.querySelectorAll('.register-link').forEach(function (el) {
            el.href = url;
        });
    }
});
