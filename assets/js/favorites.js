import { GithubUser } from './githubUser.js';

const table = document.querySelector('table');

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);

      if (userExists) {
        throw new Error('Usuário já cadastrado');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!');
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector('table tbody');

    this.update();
    this.onAdd();
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
    this.disappearHome();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user a').href = `https://github.com/${user.login}`;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.repositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar esta linha?');

        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    /*criando elementos HTML com Javascript*/
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/arks-lacerda.png"
        alt="Image by Arthur Lacerda"
      />
      <a href="https://github.com/arks-lacerda" target="_blank">
        <p>Arthur Lacerda</p>
        <span>arks-lacerda</span>
      </a>
    </td>
    <td class="repositories">76</td>
    <td class="followers">9876</td>
    <td>
      <button class="remove">
        <svg
          class="trash-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-trash"
          viewBox="0 0 16 16"
        >
          <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
          />
          <path
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
          />
        </svg>
      </button>
    </td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });
  }

  disappearHome() {
    if (this.entries.length === 0) {
      this.root.querySelector('.home-page').classList.remove('hide');

      table.style.borderBottomLeftRadius = '0rem';
      table.style.borderBottomRightRadius = '0rem';
    } else {
      this.root.querySelector('.home-page').classList.add('hide');
      this.root.querySelector('input').value = '';
      table.style.borderRadius = '1.2rem';
    }
  }
}
