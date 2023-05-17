const Pool = require('pg').Pool
const pool = new Pool({
  user: 'app_user',
  host: 'localhost',
  database: 'rick_morty_data',
  password: 'my_password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM characters ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM characters WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, last_name, status } = request.body
  
  pool.query(`INSERT INTO characters (name, last_name, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $4) RETURNING *`,
    [name, last_name, status, new Date()], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Character added with ID: ${results.rows[0].id}`)
    }
  )
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, last_name, status } = request.body
  
  pool.query(`UPDATE characters
        SET name = $2, last_name = $3, status = $4,
          updated_at = $5
        WHERE id = $1`,
    [id, name, last_name, status, new Date()],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)
  
  pool.query('DELETE FROM characters WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}