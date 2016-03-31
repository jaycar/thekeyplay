

/**
  * Article data should have the following:
  * id, title, content, author, date, numComments, score, 
  *
  */
function Article(data) {
	this.data = data;
	this.article = $("<div class='article' id='" + this.data.id + "'>");

	// title
	var title = $("<h1 class='title'>" + data.title + "</h1>");
	this.article.append(title);

	// article details row
	this.article.append(this.createArticleDetailsPanel());

	// content
	var content = $("<div class='content'>");
	content.html(this.data.content);
	this.article.append(content);

	// topic score
	var voter = new Voter({"votes": 18, "title": "Topic Score"});
	this.article.append(voter.getContent());
}

Article.prototype.getArticle = function() {
	return this.article;
}

Article.prototype.createArticleDetailsPanel = function() {
	var detailsRow = $("<div class='details-row'>");

	detailsRow.append($("<span>By: </span>"));
	detailsRow.append($("<a class='tkp-link author'>" + this.data.author + "</a>"));
	detailsRow.append($("<span> on </span>"));
	detailsRow.append($("<a class='date'>" + this.data.date + "</a>"));
	detailsRow.append($("<span> | </span>"));
	detailsRow.append($("<a class='tkp-link numComments'>" + this.data.numComments + " comments</a>"));

	return detailsRow;
}