var $builtinmodule = function(name) {
	var mod = {
		messages: ["Congratulations Mr Bradley, on passing your school direct training",
		"All the very best for the future",
		"You're a fab teacher",
		"It's been great to work with you",
		"We'll miss you"
		]
	};
	var html = '<style>#unicorn{position: absolute;left: 0px; top: 0px;transition: all 1s;}</style><img id="unicorn" src="/lib/skulpt/schooldirect/unicorn.png">';
	html += '<marquee id="scroller">Congratulations on passing your school direct training</marquee>';
	PythonIDE.python.output(html);
	
	setInterval(function() {
		var y = Math.round(Math.random() * 10);
		var r = Math.round(Math.random() * 10);
		$("#unicorn").css({'top': y + "%", 'left': '50%', 'transform':'rotate(' + r + 'deg)'});
	}, 1000);
	
	$('#unicorn').click(function() {
		var i = Math.floor(Math.random() * mod.messages.length);
		var msg = mod.messages[i];
		$('#scroller').html(msg);
	});
	
	
	return mod;
};