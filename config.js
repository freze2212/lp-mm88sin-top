/**
 * Cấu hình Domain & Affiliate Link tự động
 * Thêm / sửa domain trực tiếp trong file domains.json hoặc đối tượng DOMAIN_MAP bên dưới.
 */
(function () {
    'use strict';

    var DEFAULT_REGISTER_URL = 'https://mm88e9e23qc.mm2188.com/register.html';

    // Fallback nếu không tải được domains.json (ví dụ chạy offline file://)
    var INLINE_DOMAINS = {
        "_default": DEFAULT_REGISTER_URL,
        "mm88sin.top": DEFAULT_REGISTER_URL,
        "mm88ci.com": "https://mm88e9e27qc.mm4111.com/register.html"
    };

    function getCleanHost() {
        return (window.location.hostname || '').replace(/^www\./i, '').toLowerCase();
    }

    function pickUrl(entry) {
        if (!entry) return null;
        if (typeof entry === 'string') return entry;
        return entry.main_url || entry.target_url || entry.register_url || entry.url || null;
    }

    function findEntry(data, currentHost) {
        if (!data) return null;
        if (data[currentHost]) return data[currentHost];
        var target = currentHost.toLowerCase();
        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                if (key.replace(/^www\./i, '').toLowerCase() === target) {
                    return data[key];
                }
            }
        }
        return null;
    }

    function applyConfig(data) {
        data = data || INLINE_DOMAINS;
        var currentHost = getCleanHost();
        var entry = findEntry(data, currentHost);
        var targetUrl = pickUrl(entry) || pickUrl(data._default) || DEFAULT_REGISTER_URL;

        // Cho phép override link qua query param: ?target=... hoặc ?link=...
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.has('target')) targetUrl = params.get('target');
            else if (params.has('link')) targetUrl = params.get('link');
            else if (params.has('aff')) targetUrl = params.get('aff');
        } catch (e) {}

        window.SITE_CONFIG = {
            domain: currentHost || 'mm88sin.top',
            registerUrl: targetUrl,
            allDomains: data
        };

        window.REDIRECT_URL = targetUrl;

        // Cập nhật tất cả các link trên trang
        updateLinks(targetUrl);

        // Bắn event để các script khác có thể lắng nghe
        window.dispatchEvent(
            new CustomEvent('domainConfigLoaded', {
                detail: { url: targetUrl, host: currentHost }
            })
        );
    }

    function updateLinks(url) {
        if (!url) return;
        var links = document.querySelectorAll('.register-link');
        links.forEach(function (el) {
            el.href = url;
        });
    }

    // Khởi tạo ngay với inline config
    applyConfig(INLINE_DOMAINS);

    // Tải domains.json động
    if (window.location.protocol.indexOf('http') === 0) {
        fetch('domains.json?v=' + Date.now())
            .then(function (res) {
                if (!res.ok) throw new Error('Cannot load domains.json');
                return res.json();
            })
            .then(function (data) {
                applyConfig(data);
            })
            .catch(function (err) {
                console.warn('Lỗi tải domains.json, sử dụng cấu hình mặc định:', err);
            });
    }

    // Đảm bảo sau khi DOMContentLoaded các thẻ a đều được gắn link
    document.addEventListener('DOMContentLoaded', function () {
        if (window.REDIRECT_URL) {
            updateLinks(window.REDIRECT_URL);
        }
    });
})();
