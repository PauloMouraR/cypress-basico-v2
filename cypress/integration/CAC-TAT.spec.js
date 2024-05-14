/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function(){
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const textoLongo = 'Preferências de Comunicação: O cliente indicou preferência por comunicação via e-mail para todas as atualizações relacionadas a este pedido.' +
        'Certifique-se de utilizar este meio para qualquer informação relevante, a fim de garantir uma experiência de serviço eficiente e personalizada.'
        
        cy.get('#firstName').type('Paulo')
        cy.get('#lastName').type('Moura')
        cy.get('#email').type('paulomoura@emailteste.com')
        cy.get('#open-text-area').type(textoLongo, {delay: 0})
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function (){
        cy.get('#firstName').type('Paulo')
        cy.get('#lastName').type('Moura')
        cy.get('#email').type('paulomoura@emailteste,com') //Fora dos padrões de formatação
        cy.get('#open-text-area').type('Conteúdo para o campo de Observação')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })

    it('Campo telefone continua vazio quando preenchido com um valor não númerico', function(){
        cy.get('#phone')
            .type('abcdef')
            .should('be.be.empty')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Paulo')
        cy.get('#lastName').type('Moura')
        cy.get('#email').type('paulomoura@emailteste.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Conteúdo para o campo de Observação')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Paulo')
            .should('have.value', 'Paulo')
            .clear()
            .should('be.empty')
        
        cy.get('#lastName').type('Moura')
            .should('have.value', 'Moura')
            .clear()
            .should('be.empty')
        
        cy.get('#email').type('paulomoura@emailteste.com')
            .should('have.value', 'paulomoura@emailteste.com')
            .clear()
            .should('be.empty')

        cy.get('#phone').type('941419488')
            .should('have.value', '941419488')
            .clear()
            .should('be.empty')    
        
        cy.get('#open-text-area').type('Conteúdo para o campo de Observação')
            .should('have.value', 'Conteúdo para o campo de Observação')
            .clear()
            .should('be.empty')
    })
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })
    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit('Paulo', 'Moura', 'paulomoura@teste.com', 'Conteúdo para o campo de Observação')


        cy.get('.success').should('be.visible')
    })
    it('Protegendo dados sensiveis', function()  {
        cy.get('#firstName').type(Cypress.env('primeiro_nome'))
        cy.get('#lastName').type(Cypress.env('sobrenome'))
        cy.get('#email').type(Cypress.env('email'), {log: false})
        cy.get('#open-text-area').type(Cypress.env('obs'))
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })
    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
          .select('YouTube')
          .should('have.value', 'youtube')
    })
    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
          .select('mentoria')
          .should('have.value', 'mentoria')
    })
    it('seleciona o produto "Blog" por seu índice', function(){
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })
    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[value="feedback"]')
          .check()
          .should('be.checked')
    })
    it('marca cada tipo de atendimento',function(){
        cy.get('input[type="radio"')
          .should('have.length', 3)
          .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
          })
    })

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
          .check().should('be.checked')
          .last()
          .uncheck().should('not.be.checked')
    })
    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('#file-upload').should('not.have.value')
          .selectFile('./cypress/fixtures/example.json')
          .should(function($input){
            expect($input[0].files[0].name).to.be.equal('example.json')
          })
    })
    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('#file-upload').should('not.have.value')
          .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
          .should(function($input){
            expect($input[0].files[0].name).to.be.equal('example.json')
          })
    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('arquivoTeste')
        cy.get('#file-upload')
          .selectFile('@arquivoTeste')
          .should(function($input){
            expect($input[0].files[0].name).to.be.equal('example.json')
    })
  })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
          .invoke('removeAttr', 'target')
          .click()
          cy.contains('Talking About Testing').should('be.visible')
    })
})