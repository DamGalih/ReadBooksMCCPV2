describe('Cari Buku Berdasarkan UUID (Login Sekali)', () => {
  const email = '';
  const password = '';

  before(function () {
    cy.task('readExcel').then((data) => {
      this.uuids = data;
    });
  });

  beforeEach(() => {
    cy.session('loginSession', () => {
      cy.visit('https://portal.moco.co.id/login', { failOnStatusCode: false });

      cy.get('input#email', { timeout: 10000 }).should('be.visible').type(email);
      cy.get('input#password').type(password);
      cy.get('button[type="submit"]').click();

      cy.url().should('include', 'dashboard-catalog');
    });
  });

  it('Navigasi ke Buku Elektronik dan cari berdasarkan UUID', function () {
    cy.visit('https://portal.moco.co.id/dashboard-catalog', { failOnStatusCode: false });

    // Klik menu "Konten Digital"
    cy.contains('.ant-menu-submenu-title', 'Konten Digital').click({ force: true });

    // Klik submenu "Buku Elektronik"
    cy.get('a[href="/digital/ebook"]').click({ force: true });

    // Loop semua UUID
    this.uuids.forEach((row) => {
      const uuid = row.UUID;

      cy.get('input[placeholder="Pencarian..."]', { timeout: 10000 }).should('be.visible');
      cy.get('input[placeholder="Pencarian..."]').clear().type(uuid);
      cy.get('button.ant-input-search-button').click({ force: true });

      cy.wait(3000);

      cy.get('body').then(($body) => {
        if ($body.find('.ant-card-body').length > 0) {
          cy.get('[data-icon="more"]')
            .first()
            .parents('button')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

          cy.get('.ant-dropdown:not(.ant-dropdown-hidden)')
            .contains('li.ant-dropdown-menu-item', 'Baca Buku')
            .click({ force: true });

          // Tunggu modal tampil
          cy.get('.ant-modal-wrap', { timeout: 10000 }).should('be.visible');

         // Pastikan kontainer dokumen PDF muncul
cy.get('.react-pdf__Document.custom-doc-wrapper', { timeout: 30000 })
  .should('exist')
  .scrollIntoView();

// Tunggu halaman pertama muncul (tidak hanya ada, tapi siap ditampilkan)
cy.get('.react-pdf__Page', { timeout: 70000 })
  .first()
  .should('exist')
  .scrollIntoView();


// ✅ Pastikan halaman PDF benar-benar terlihat
cy.get('.react-pdf__Page', { timeout: 20000 })
  .first()
  .scrollIntoView()
  .should('be.visible');

          // Klik tombol Bookmark
          cy.get('button.btn-bookmark', { timeout: 20000 })
            .should('be.visible')
            .click({ force: true });

          // Tunggu daftar bookmark tampil
          cy.get('.pdf-viewer-bookmark.show', { timeout: 20000 })
          .should('exist');


          // Klik bookmark
          /*cy.get('.pdf-viewer-bookmark.show .ant-menu-item')
            .eq(1)
            .click({ force: true });*/

// Cek apakah ada bookmark di dalam daftar
cy.get('.pdf-viewer-bookmark.show .ant-menu-item').then(($items) => {
  if ($items.length > 1) {
    // Klik bookmark ke-2 (index 1)
    cy.wrap($items.eq(1)).click({ force: true });
  } else if ($items.length === 1) {
    // Kalau hanya 1 bookmark, klik yang ada (optional)
    cy.wrap($items.eq(0)).click({ force: true });
  } else {
    // Tidak ada bookmark, log info
    cy.log('📌 Tidak ada bookmark yang tersedia di file ini.');
       }
});     

          // Klik tombol Bookmark
          cy.get('button.btn-bookmark', { timeout: 20000 })
          .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

// Klik tombol "Properties"
cy.get('button.btn-properties')
  .should('be.visible')
  .click({ force: true });

// Tunggu modal tampil
cy.get('.ant-modal-body', { timeout: 10000 }).should('exist');

// Validasi Title tidak kosong
cy.get('.ant-modal-body .ant-row')
  .contains('div', 'Title')
  .parent()
  .within(() => {
    cy.get('div').last().invoke('text').then((text) => {
      expect(text.trim(), 'Title tidak boleh kosong').to.not.eq('');
    });
  });

// Validasi Author tidak kosong
cy.get('.ant-modal-body .ant-row')
  .contains('div', 'Author')
  .parent()
  .within(() => {
    cy.get('div').last().invoke('text').then((text) => {
      expect(text.trim(), 'Author tidak boleh kosong').to.not.eq('');
    });
  });

// Klik tombol "Ok" untuk menutup modal
cy.contains('button.ant-btn-dangerous span', 'Ok')
  .should('be.visible')
  .first() // pastikan hanya ambil satu
  .click({ force: true });


          // Tutup modal reader
           cy.get('.ant-modal-wrap:visible')
          .find('button svg[data-icon="close"]')
          .first()
          .parents('button')
          .click({ force: true });

          // Pastikan modal sudah tertutup
          cy.get('.ant-modal-wrap', { timeout: 20000 }).should('not.be.visible');

          // Pastikan kembali ke halaman pencarian
          cy.get('input[placeholder="Pencarian..."]', { timeout: 10000 }).should('be.visible');

        } else {
          cy.log(`UUID ${uuid} tidak ditemukan`);
        }
      });
    });
  });
});
