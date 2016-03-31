
$(document).ready(function() {
	var articleData = {
		"id": 0,
		"title": "smell it - first day of pads practice",
		"content": "...",
		"author": "french60wasp",
		"date": "March 26, 2016, 10:14 AM",
		"numComments": 98,
		"score": 45
	}

	var comments = [{"id": 0, "comment": "hello", "image": "../images/user_jay_avatar.png", "username": "JiveHokie"}, 
	{"id": 1, "comment": "world", "image": "../images/user_jay_avatar.png", "username": "JiveHokie"}, 
	{"parent": 0, "id": 3, "comment": "derp", "image": "../images/user_jay_avatar.png", "username": "JiveHokie"}, 
		{"parent": 3, "id": 4, "comment": "boom", "image": "../images/user_jay_avatar.png", "username": "JiveHokie"}, 
		{"parent": 3, "id": 5, "comment": "city", "image": "../images/user_jay_avatar.png", "username": "JiveHokie"}];

	// grab main panel
	var $mainPanel = $("#center-column");

	// add the article
	var article = new Article(articleData);
	$mainPanel.append(article.getArticle());

	// add the comment section
	var forum = new Forum(comments);
	forum.layout();
	$mainPanel.append(forum.getContent());
})

function Forum(comments) {
	this.comments = comments;
	this.editor = new Editor();

	// main content
	this.$content = $("<div id='forum'>");
	
	// holds all the comments
	this.$commentPanel = $("<div id='comment-panel'>");
	this.$content.append(this.$commentPanel);

	// holds the preview comment
	this.$previewPanel = $("<div id='preview-panel'>");
	this.$content.append(this.$previewPanel);

	// add the editor
	this.createEditorPanel();

	// holds the content that you're replying too, whether that's a comment or article
	this.$replyPanel = $("<div id='reply-panel'>");
	this.$content.append(this.$replyPanel);
}

Forum.prototype.getCommentDetailsFromId = function(id) {
	for (var i = 0; i < this.comments.length; i++) {
		if (id === this.comments[i].id) {
			return this.comments[i];
		}
	}

	return null;
}

Forum.prototype.replyToComment = function(commentId) {
	this.$commentPanel.hide();

	var replyComment = new Comment(this.getCommentDetailsFromId(commentId));
	this.$replyPanel.empty();
	this.$replyPanel.append(replyComment.getComment());

	this.cancelButton.show();
}

Forum.prototype.createEditorPanel = function() {
	// Add the editor section
	var $editorPanel = $("<div id='editor-section'>");
	this.$content.append($editorPanel);

	var commentHeader = $("<h3>Add new comment</h3>");
	$editorPanel.append(commentHeader);

	var commentLabel = $("<label id='editor-label'>Comment</label>");
	$editorPanel.append(commentLabel);

	// add the comment editor
	$editorPanel.append(this.editor.$content);

	// add the action buttons
	$editorPanel.append(this.createPostButton());
	$editorPanel.append(this.createPreviewButton());

	var cancelButton = this.createCancelPreviewButton();
	cancelButton.hide();
	$editorPanel.append(cancelButton);
}

Forum.prototype.layout = function() {
	var comments = this.comments;

	var len = comments.length;
	for (var i = 0; i < len; i++) {
		var commentDetails = comments[i];
		var comment = new Comment(commentDetails);
		comment.setReplyHandler(this.replyToComment.bind(this, commentDetails.id));
		
		var parentId = commentDetails.parent;
		if ("parent" in commentDetails) {
			// this is a child comment
			var parentComment = this.$content.find("#comment-" + parentId);
			parentComment.append(comment.getComment());

		} else {
			// this is a top-level comment
			this.$commentPanel.append(comment.getComment());
		}
	}
}

Forum.prototype.getContent = function() {
	return this.$content;
}

Forum.prototype.createPostButton = function() {
	var postButton = $("<button>Post</button>");
	postButton.click(function() {
		window.alert("posting the comment to the server!");

		// TODO lets get posting working!
	});

	return postButton;
}

Forum.prototype.createPreviewButton = function() {
	var forum = this;
	var previewButton = $("<button>Preview</button>");
	previewButton.click(function() {
		// hide the regular comments
		forum.$commentPanel.hide();

		// create a comment and add it to the preview panel
		var previewComment = new Comment({"id": "999999", "comment": forum.editor.getText()});
		forum.$previewPanel.empty();
		forum.$previewPanel.append(previewComment.getComment());

		forum.cancelButton.show();
	});

	return previewButton;
}

Forum.prototype.createCancelPreviewButton = function() {
	var forum = this;
	this.cancelButton = $("<button>Cancel</button>");
	this.cancelButton.click(function() {
		forum.$previewPanel.empty();
		forum.$replyPanel.empty();
		forum.editor.setText("");
		forum.$commentPanel.show();
		forum.cancelButton.hide();
	});

	return this.cancelButton;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/**
  * A comment for the forum.
  *
  * @param details
  *          - An object that contains:
  *              (1) a user object with a username, image, and signature
  *              (2) a date, comment score, and comment body
  *
  */
function Comment(details) {
	this.details = details;
	this.$contentWrapper = $("<div class='comment-wrapper'>");
	this.$contentWrapper.attr("id", "comment-" + details.id);

	this.$content = $("<div class='comment'>");
	this.$content.data("parent", details.parent);
	this.$contentWrapper.append(this.$content);

	this.createCommentHeader();
	this.createCommentBody();
	this.createCommentFooter();
	
}

Comment.prototype.createCommentHeader = function() {
	var $header = $("<div class='header'>");


	// create the user image icon
	var $imageWrapper = $("<a class='image-wrapper'>");
	var $userImage = $("<img class='user-avatar' alt=\"user's image\" src='" + this.details.image + "'>")
	$imageWrapper.append($userImage);
	$header.append($imageWrapper);

	$header.append($("<a class='username tkp-link'>" + this.details.username + "</a>"));
	$header.append($("<span>|</span>"));

	$header.append("<span class='date'>1 month 21 hours</span>");
	$header.append("<span class='collapse open'></span>");

	this.$content.append($header);
}

Comment.prototype.createCommentBody = function() {
	var $body = $("<div class='body'>");
	$body.html(this.details.comment);

	this.$content.append($body);
}

Comment.prototype.setReplyHandler = function(handler) {
	this.replyHandler = handler;
}

Comment.prototype.createCommentFooter = function() {
	var $footer = $("<div class='footer'>");
	var comment = this;

	$footer.append($("<div class='signature'>Exit Light...</div>"));
	
	$footer.append(new Voter({"votes": 5, "title": "Comment Score"}).getContent());

	$footer.append($("<a class='reply tkp-link'>reply</a>"))

	this.$content.append($footer);
}

Comment.prototype.getComment = function() {
	return this.$contentWrapper;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

/**
  * data should have:
  *    votes, title
  *
  */
function Voter(data) {
	this.data = data;
	this.originalVotes = data.votes;
	var voter = this;
	this.$votePanel = $("<div class='vote-panel'>");

	this.$votePanel.append($("<span>" + data.title + ":</span>"));

	// add score
	this.$score = $("<span class='score'>" + this.formatVoteString() + "</span>");
	this.$votePanel.append(this.$score);

	// add separator
	this.$votePanel.append($("<span class='separator'> | Vote:</span>"));

	// add vote buttons
	this.$votePanel.append(this.createVoteButton("&#x25b2;", "upvote"));
	this.$votePanel.append(this.createVoteButton("&#x25bc;", "downvote"));

	// add reset link
	this.resetVoteLink = $("<a class='reset tkp-link'>(reset)</a>");
	this.resetVoteLink.click(function() {
		$(this).hide();
		voter.$votePanel.find(".vote").removeClass("selected");
		voter.setVotes(voter.originalVotes);
	});
	this.resetVoteLink.hide();
	this.$votePanel.append(this.resetVoteLink);

}

Voter.prototype.setVotes = function(votes) {
	this.data.votes = votes;
	this.$score.text(this.formatVoteString());
}

Voter.prototype.formatVoteString = function() {
	var votes = this.data.votes;
	if (votes == 0) {
		return "0";
	} else if (votes > 0) {
		return "+" + votes;
	} else {
		return "-" + votes;
	}
}

Voter.prototype.getContent = function() {
	return this.$votePanel;
}

Voter.prototype.createVoteButton = function(char, style) {
	var voter = this;
	var voteButton = $("<a class='" + style + " vote'>" + char + "</a>");
	voteButton.attr("title", "Vote " + ((style === "upvote") ? "up" : "down") + "!");
	voteButton.click(function() {
		if (!$(this).hasClass("selected")) {
			voter.getContent().find(".vote").removeClass("selected");
			$(this).addClass("selected");
			voter.resetVoteLink.show();

			if (style === "upvote") {
				voter.setVotes(voter.originalVotes + 1);
			} else {
				voter.setVotes(voter.originalVotes - 1);
			}
		}
	});

	return voteButton;
}


