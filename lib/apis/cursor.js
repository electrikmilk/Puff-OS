$(function () {
	$("*").each(function () {
		if ($(this).css("cursor") === "pointer") {
			$(this).css("cursor", "url('/res/cursors/pointer.png'), auto");
		}
		if ($(this).css("cursor") === "text" || $(this).attr("contenteditable")) {
			$(this).css("cursor", "url('/res/cursors/text.png'), auto");
		}
	});
});