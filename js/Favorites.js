import { GithubUser } from './GithubUser.js'

//===============================FAVORITES===================================================================
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  //Uncaught SyntaxError: "undefined" is not valid JSON ================================================

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if (userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (erro) {
      alert(erro.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

//===============================FAVORITESVIEW===============================================================

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
    }
  }

  update() {
    this.removeAlltr()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagen de ${user.name}`
      row.querySelector('.user p').href = `https://github.com/${user.login}.`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeze que deseja deletar o usuário?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.emptyPage()

      this.tbody.append(row)
    })
  }

  emptyPage() {
    let page = document.querySelector('#isEmpty')

    if(this.entries.lenght != 0) {
      page.classList.add('hidden')
    }
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/milsucruz.png" alt="Imagem de milsu cruz">
          <a href="https://github.com/milsucruz" target="_blank">
            <p>Edmilson Cruz</p>
            <span>/milsucruz</span>
          </a>
        </td>

        <td class="repositories">0</td>
        <td class="followers">0</td>
        <td>
          <button class="remove">Remover</button>
        </td>`

    return tr
  }

  removeAlltr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
