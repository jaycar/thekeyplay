
$(document).ready(function() {
	var headlinePanel = new HeadlinePanel({});
	$("#center-column").append(headlinePanel.$content);
})

function HeadlinePanel(data) {
	this.data = data;
	this.$content = $("<div id='article-panel'>");

	for (var i = 0; i < 10; i++) {
		this.$content.append(new Headline({}).getContent());
	}
}

function Headline(data) {
	this.data = data;
	this.$content = $("<div class='article'>");

	this.$content.append(this.createImagePanel());
	this.$content.append(this.createDetailsPanel());
}

Headline.prototype.getContent = function() {
	return this.$content;
}

Headline.prototype.createImagePanel = function() {
	var imagePanel = $("<div class='image-wrapper'>");
	var image = $("<img src='../article_images/article1_image.jpg' alt=''></img>");
	imagePanel.append(image);

	return imagePanel;
}

Headline.prototype.createDetailsPanel = function() {
	var detailsPanel = $("<div class='details-panel'>");

	// header
	var header = $("<h2 class='article-header'>" + "BUZZKETBALL GETS DOMINATED IN PITTSBURGH 70-71" + "</h2>");
	detailsPanel.append(header);

	// stats
	var stats = $("<div class='article-stats'>");
	stats.append($("<span>By: </span>"));
	stats.append($("<a class='article-author article-link tkp-link'>" + "Joe Lanza" + "</a>"));
	stats.append($("<span> on </span>"));
	stats.append($("<span class='article-date article-link tkp-link'>" + "February 3, 2016, 6:45 PM" + "</span>"));
	stats.append($("<span> | </span>"));
	stats.append($("<a class='article-comments article-link tkp-link'>" + "161 comments" + "</a>"));
	stats.append($("<a class='article-unread-comments article-link tkp-link'>" + "4 unread" + "</a>"));
	detailsPanel.append(stats);

	// description
	detailsPanel.append($("<p class='article-description'>" + "Hokies reportedly lose one of their top position coaches and recruiters" + "</p>"));

	return detailsPanel;
}