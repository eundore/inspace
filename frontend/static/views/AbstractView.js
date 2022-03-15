export default class {
  content;

  constructor(params) {
    this.params = params;
  }

  setTitle(title) {
    document.title = title;
  }

  async getHtml(path) {
    if (!this.content) {
      await fetch(`http://localhost:5000/template/${path}`)
        .then((res) => res.json())
        .then((res) => {
          this.content = "" + res.data.trim();
        });
    }
    return this.content;
  }

  defaultFunc() {}
}
