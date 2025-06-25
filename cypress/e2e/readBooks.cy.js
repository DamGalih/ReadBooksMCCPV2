describe('Cari Buku Berdasarkan UUID (Login Sekali)', () => {
const email = Cypress.env('email');
const password = Cypress.env('password');


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
      let isBookmarkAvailable = false;
      let isMetadataAvailable = false;

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
          cy.get('.ant-modal-wrap', { timeout: 50000 }).should('be.visible');

         // Pastikan kontainer dokumen PDF muncul
cy.get('.react-pdf__Document.custom-doc-wrapper', { timeout: 40000 })
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
  .scrollIntoView({ block: 'center' })
  .should('exist')
  .invoke('outerHeight')
  .should('be.gte', 10);

  cy.wait(5000);

// ✅ Periksa keseragaman lebar semua halaman
cy.get('canvas.react-pdf__Page__canvas', { timeout: 20000 }).then(($canvases) => {
  const widths = [];

  Cypress._.each($canvases, (canvas) => {
    widths.push(canvas.offsetWidth);
  });

  const allWidthsEqual = widths.every((w) => w === widths[0]);

  if (!allWidthsEqual) {
    cy.log('❌ Lebar tidak seragam:', widths);
    throw new Error(`Lebar halaman tidak konsisten: ${widths}`);
  } else {
    cy.log('✅ Semua halaman memiliki lebar yang sama:', widths[0]);
  }
});

          // Klik tombol Bookmark
          cy.get('button.btn-bookmark', { timeout: 20000 })
          .scrollIntoView()
            .should('be.visible')
            .click({ force: true });

          // Tunggu daftar bookmark tampil
          cy.get('.pdf-viewer-bookmark.show', { timeout: 20000 })
          .should('exist');


          // Cek apakah ada bookmark di dalam daftar
cy.get('.pdf-viewer-bookmark.show .ant-menu-item').then(($items) => {
  if ($items.length > 0) {
    isBookmarkAvailable = true;
    // Klik bookmark ke-2 (index 1)
    cy.wrap($items.eq(0)).click({ force: true });
  } else {

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

// Cek apakah elemen Title ada
cy.get('.ant-modal-body .ant-row').then(($rows) => {
  const titleRow = $rows.toArray().find(row => row.innerText.includes('Title'));

  if (titleRow) {
    cy.wrap(titleRow).within(() => {
      cy.get('div').last().invoke('text').then((text) => {
        if (text.trim() !== '') {
          isMetadataAvailable = true;
        }
      });
    });
  } else {
    cy.log('🔍 Metadata Title tidak ditemukan.');
    isMetadataAvailable = false;
  }
});

cy.get('.ant-modal-body .ant-row').then(($rows) => {
  const AuthorRow = $rows.toArray().find(row => row.innerText.includes('Author'));

  if (AuthorRow) {
    cy.wrap(AuthorRow).within(() => {
      cy.get('div').last().invoke('text').then((text) => {
        if (text.trim() !== '') {
          isMetadataAvailable = true;
        }
      });
    });
  } else {
    cy.log('🔍 Metadata Author tidak ditemukan.');
    isMetadataAvailable = false;
  }
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
          
           cy.then(() => {
            cy.get('input.ant-checkbox-input').first().click({ force: true });
            cy.get('input#action-move-catalog').click({ force: true });
          if (isBookmarkAvailable && isMetadataAvailable) {
              cy.contains('.ant-select-item-option-content', 'Ubah Produk Terverifikasi')
                .click({ force: true });
            } else {
              cy.contains('.ant-select-item-option-content', 'Ubah Produk diblokir')
                .click({ force: true });
            }
              // Klik tombol Pilih
                cy.contains('button span', 'Pilih')
               .should('be.visible')
                .click({ force: true });

                // Klik tombol Proses di modal berikutnya
                cy.contains('button span', 'Proses', { timeout: 10000 })
                .should('be.visible')
                .click({ force: true });
          });


          // Pastikan kembali ke halaman pencarian
          cy.get('input[placeholder="Pencarian..."]', { timeout: 10000 }).should('be.visible');

        } else {
          cy.log(`UUID ${uuid} tidak ditemukan`);
        }
      });
    });
  })
})
