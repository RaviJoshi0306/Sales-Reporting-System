/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

describe('Sales Report Review Page', () => {
  test('renders the Sales Report Review header and structure', () => {
    document.body.innerHTML = `
    <header class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <a href="report_review.html" class="d-flex align-items-center text-decoration-none">
                    <span id="company-logo" class="rounded-pill px-3 py-1 bg-light-blue text-secondary">
                        <img src="https://i.postimg.cc/SKq3ZtJZ/KK-logo.png" alt="Sanyo Steel Co Ltd Logo" style="max-height: 40px; max-width: auto;">
                    </span>
                    <span id="report-review" class="h4 font-weight-bold ml-2" style="color: #00a4b3;">営業報告システム</span>
                </a>
            </div>
            <div class="d-flex align-items-center">
                <div id="language-switch" class="mr-4">
                    <a id="lang-jp" class="text-muted">日本語</a> | 
                    <a id="lang-en" class="text-muted">English</a>
                </div>
                <button id="new-report-btn" class="btn btn-primary mr-3">
                    <i class="fas fa-edit"></i> 新規作成
                </button>
                <div class="dropdown">
                    <button class="btn btn-outline-secondary profile-button" type="button" id="profileButton">
                        <i class="fas fa-user-circle"></i>
                        <span id="salesRepName">Loading...</span>
                        <i class="fas fa-chevron-down dropdown-arrow"></i>
                    </button>
                    <ul class="dropdown-menu" id="dropdownMenu" style="display:none;">
                        <li>
                            <button id="logout" class="dropdown-item text-danger">
                                <i class="fas fa-power-off"></i> ログアウト
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    `;

    expect(document.body).toMatchSnapshot();
  });
});
