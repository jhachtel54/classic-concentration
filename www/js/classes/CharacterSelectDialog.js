class CharacterSelectDialog
{
    constructor()
    {
        this.dom = document.createElement("div");
        this.dom.id = "characterSelectDialog";
        this.dom.classList.add("position-absolute");

        var border = document.createElement("div");
        border.classList.add("position-absolute");
        this.dom.appendChild(border);

        this.content = DocumentTimeline.createElement("div");
        this.content.classList.add("position-absolute", "container-fluid");
        border.appendChild(this.content);
    }
    
    GetDOM()
    {
        return this.dom;
    }
}