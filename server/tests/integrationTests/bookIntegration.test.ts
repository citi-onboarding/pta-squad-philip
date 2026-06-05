import request from 'supertest'
import { app } from '../../src/server'
import prisma from '../../src/database'

let livroId: string

beforeAll(async () => {
  const livro = await prisma.livro.create({
    data: {
      titulo: 'Livro de Teste',
      autor: 'Autor Teste',
      isbn: '9780132350884',
      editora: 'Editora Teste',
      ano: 2020,
      quantidade_total: 5,
      quantidade_disponivel: 5,
      categoria: 'Tecnologia',
    }
  })
  livroId = livro.id
})

afterAll(async () => {
  await prisma.livro.deleteMany({
    where: { autor: 'Autor Teste' }
  })
  await prisma.$disconnect()
})

describe('POST /livros', () => {
  test('if the book data is valid, it should return status 201.', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Outro Livro',
        autor: 'Autor Teste',
        isbn: '9780000000002',
        editora: 'Editora Teste',
        ano: 2021,
        quantidade_total: 3,
        categoria: 'Tecnologia',
      })

    expect(response.status).toBe(201)
  })

  test('if any field is missing, it should return status 400.', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro Incompleto',
      })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })

  test('invalid ISBN, should return status 400.', async () => {
    const response = await request(app)
      .post('/livros')
      .send({
        titulo: 'Livro ISBN Ruim',
        autor: 'Autor Teste',
        isbn: '123',
        editora: 'Editora Teste',
        ano: 2021,
        quantidade_total: 3,
        categoria: 'Tecnologia',
      })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('message')
  })
})

describe('GET /livros', () => {
  test('when searching for all books, it should return status 200 and an array of books.', async () => {
    const response = await request(app).get('/livros')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  test('when filtering books by category, it should return status 200 and an array of books only from that category.', async () => {
    const response = await request(app).get('/livros?categoria=Tecnologia')

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    response.body.forEach((livro: any) => {
      expect(livro.categoria).toBe('Tecnologia')
    })
  })
})

describe('GET /livros/:id', () => {
  test('when searching for a book by its ID, it should return status 200 and the book with the corresponding ID.', async () => {
    const response = await request(app).get(`/livros/${livroId}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', livroId)
  })

  test('when searching for a book using a non-existent ID, it should return a 404 status.', async () => {
    const response = await request(app).get('/livros/id-inexistente')

    expect(response.status).toBe(404)
  })
})

describe('DELETE /livros/:id', () => {
  test('when deleting a book using an existing ID, it should return status 200.', async () => {
    const response = await request(app).delete(`/livros/${livroId}`)

    expect(response.status).toBe(200)
  })
})