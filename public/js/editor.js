SIMPLE_BUTTON_PROPERTIES = [
	["bold", "Bold", "<strong></strong>", 8, "&#xe800;"],
	["italics", "Italics", "<em></em>", 4, "&#xe801;"],
	["underline", "Underline", "<u></u>", 3, "&#xe802;"],
	["strike-through", "Strike-through", "<strike></strike>", 8, "&#xe80a;"],
	["unordered-list", "Unordered List", "<ul><li></li></ul>", 8, "&#xe803;"],
	["ordered-list", "Ordered List", "<ol><li></li></ol>", 8, "&#xe804;"],
	["quote", "Quote", "<blockquote></blockquote>", 12, "&#xe805;"]
];

function Editor() {
	this.$content = $("<div id='editor'>");
	this.$textarea = $("<textarea>");

	this.$content.append(this.createButtonPanel());
	this.$content.append(this.createInputArea());
}

Editor.prototype.getText = function() {
	var text = this.$textarea.val();

	// TODO needs more js/html sanitization

	text = text.replace("\n", "<br/>");
	return text;
}

Editor.prototype.setText = function(str) {
	str = str.replace("< /br>", "\n");
	this.$textarea.val(str);
}

Editor.prototype.createInputArea = function() {
	var $inputPanel = $("<div class='input-panel'>");
	$inputPanel.append(this.$textarea);

	var $grippie = $("<div class='grippie'>");
	$inputPanel.append($grippie);

	var $editor = this;

	// get the drag working
	var draggingGrippie = false;

	$grippie.on("mousedown", function(e) {
		draggingGrippie = true;
	});

	$(document).on("mouseup", function() {
		draggingGrippie = false;
	});

	$(document).on("mousemove", function(e) {
		if (draggingGrippie) {
			var top = (e.pageY - $inputPanel.offset().top);

			if (top < 300 && top > 50) {
				$editor.$textarea.height(top - 6);
				$grippie.css("top", top + "px");
				$inputPanel.height($editor.$textarea.height() + $grippie.height());
			}
		}
	});

	return $inputPanel;
}

Editor.prototype.createButtonPanel = function() {
	var $buttonPanel = $("<div class='button-panel'>");

	$buttonPanel.hideAllPanels = function() {
		if ($buttonPanel.displaying) {
			$buttonPanel.displaying.hide();
		}
	};

	// add insert image button
	$buttonPanel.append(this.createInsertImageButton($buttonPanel));
	$buttonPanel.append(this.createInsertLinkButton($buttonPanel));

	// add simple buttons
	for (var i = 0; i < SIMPLE_BUTTON_PROPERTIES.length; i++) {
		$buttonPanel.append(this.createSimpleTagButton(SIMPLE_BUTTON_PROPERTIES[i], $buttonPanel));
	}

	return $buttonPanel;
}

Editor.prototype.addText = function(str) {
	this.$textarea.val(this.$textarea.val() + str);
}

Editor.prototype.createInsertImageButton = function($buttonPanel) {
	var $editor = this;
	var $insertImageButton = $("<button class='insert-image editor-button'>&#xe806;</button>");

	$insertImageButton.click(function() {
		$buttonPanel.hideAllPanels();

		// show popup dialog to insert image url
		var $formPanel = $("<div class='insert-image-panel popup-panel'>");
		
		var $closeButton = $("<a class='close-button'>X</a>");
		$closeButton.click(function() {
			$formPanel.hide();
		});
		$formPanel.append($closeButton);

		// title
		$formPanel.append($("<div class='title'>Insert Image</div>"));
		
		// input panel
		var $inputRow = $("<div class='row'>");
		$inputRow.append($("<label>URL</label>"));

		var $input = $("<input>");
		$inputRow.append($input);
		$formPanel.append($inputRow);

		// submit button
		var $insertButton = $("<button class='insert-button'>Insert</button>");
		$insertButton.click(function() {
			if ($input.val().length == 0) {
				return;
			}

			$editor.addText("<img src=\"" + $input.val() + "\"/>");
			$formPanel.hide();
		});
		$formPanel.append($insertButton);

		$buttonPanel.append($formPanel);
		$buttonPanel.displaying = $formPanel;

		$input.focus();
	});

	return $insertImageButton
}

Editor.prototype.createInsertLinkButton = function($buttonPanel) {
	var $editor = this;
	var $insertLinkButton = $("<button class='insert-link editor-button'>&#xe807;</button>");

	$insertLinkButton.click(function() {
		$buttonPanel.hideAllPanels();

		// show popup dialog to insert link url
		var $formPanel = $("<div class='popup-panel'>");
		
		var $closeButton = $("<a class='close-button'>X</a>");
		$closeButton.click(function() {
			$formPanel.hide();
		});
		$formPanel.append($closeButton);

		// title
		$formPanel.append($("<div class='title'>Insert Link</div>"));
		
		// input panel
		var $urlInputRow = $("<div class='row'>");
		$urlInputRow.append($("<label>URL</label>"));

		var $urlInput = $("<input>");
		$urlInputRow.append($urlInput);
		$formPanel.append($urlInputRow);

		var $textInputRow = $("<div class='row'>");
		$textInputRow.append($("<label>Text</label>"));		

		var $textInput = $("<input>");
		$textInputRow.append($textInput);
		$formPanel.append($textInputRow);

		// submit button
		var $insertButton = $("<button class='insert-button'>Insert</button>");
		$insertButton.click(function() {
			var u = $urlInput.val();
			var t = $textInput.val();
			if (u.length == 0 || t.length == 0) {
				return;
			}

			$editor.addText("<a href=\"" + u + "\" target=\"_blank\">" + t + "</a>");

			$formPanel.hide();
		});
		$formPanel.append($insertButton);

		$buttonPanel.append($formPanel);
		$buttonPanel.displaying = $formPanel;

		$urlInput.focus();
	});

	return $insertLinkButton
}

Editor.prototype.createSimpleTagButton = function(aProperties, $buttonPanel) {
	var $button = $("<button class='" + aProperties[0] + " editor-button'>" + aProperties[4] + "</button>");
	$button.attr("title", aProperties[1]);

	var editor = this;
	$button.click(function() {
		$buttonPanel.hideAllPanels();

		// TODO ideally i would set the cursor here too
		
		var currentText = editor.$textarea.val();
		editor.$textarea.val(currentText + aProperties[2]);

		var cursorPos = currentText.length + aProperties[3];
		editor.$textarea.focus();
		editor.$textarea[0].setSelectionRange(cursorPos, cursorPos);
	});

	return $button;
}

