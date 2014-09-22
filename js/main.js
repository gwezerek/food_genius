/*jshint -W099 */
/*jslint browser: true, sub: true */
/*jshint -W099 */

'use strict';


console.log("in graphicScript");

// SETUP
// =============================================
var agreeCount = $('.viz-agree-count');
var disagreeCount = $('.viz-disagree-count');
var fbBtn = $('.js-viz-fb-btn');
var twBtn = $('.js-viz-tw-btn');

var nextBtn = $('.viz-next-btn');

var quizTemplate = _.template(
  $('.viz-template').html()
);
var templateData = [
  {
    "index": 1,
    "product": "Hummingbirds",
    "img_name": "hummingbird",
    "love": "TRUE",
    "expert": "Sunni Brown",
    "title": "Founder, The Doodle Revolution",
    "person_link": "http://www.fastcompany.com/person/sunni-brown",
    "opinion": "A creature that can migrate hundreds of miles, flap its wings 100 times per second, reach speeds of 58 mph, and be pleasing to the eye, while requiring just six calories per day is an exquisite creature indeed."
  },
  {
    "index": 2,
    "product": "Pill organizers",
    "img_name": "pills_organizer",
    "love": "FALSE",
    "expert": "Sunni Brown",
    "title": "Founder, The Doodle Revolution",
    "person_link": "http://www.fastcompany.com/person/sunni-brown",
    "opinion": "Given the number of senior citizens and the ubiquitousness of supplement-lovers, it’s baffling that the design of these devices actually seems user-antagonistic. The AARP needs a Kickstarter."
  },
  {
    "index": 3,
    "product": "Naked edison lightbulb",
    "img_name": "edison_bulb",
    "love": "TRUE",
    "expert": "Shauna Mei",
    "title": "Founder, CEO of Ahalife",
    "person_link": "http://www.fastcompany.com/person/shauna-mei",
    "opinion": "Edison’s original creation is beautiful, and has a perfect candle-lit glow that makes people look their best."
  },
  {
    "index": 4,
    "product": "My hands",
    "img_name": "hands",
    "love": "TRUE",
    "expert": "Jami Curl",
    "title": "Founder, Quin",
    "person_link": "http://www.fastcompany.com/person/jami-curl",
    "opinion": "I spend half my work day inventing candies or bettering recipes in a kitchen. The tool I rely on time and time again are my hands. From poking to pinching to gauging temperature, they always work perfectly."
  },
  {
    "index": 5,
    "product": "School lunch programs",
    "img_name": "lunch_programs",
    "love": "FALSE",
    "expert": "Jami Curl",
    "title": "Founder, Quin",
    "person_link": "http://www.fastcompany.com/person/jami-curl",
    "opinion": "Real food has been replaced by factory-produced barely-food. It’s crazy to think that cafeteria workers once made their own bread and served chicken that wasn’t in finger form."
  },
  {
    "index": 6,
    "product": "Plain white t-shirt",
    "img_name": "white_shirt",
    "love": "TRUE",
    "expert": "Jae Goodman",
    "title": "Chief Creative Officer, CAA Marketing",
    "person_link": "http://www.fastcompany.com/person/jae-goodman",
    "opinion": "Simplicity and versatility, with room for interpretation by generations of designers and consumers."
  },
  {
    "index": 7,
    "product": "The human neck",
    "img_name": "neck",
    "love": "FALSE",
    "expert": "Tal Dehtiar",
    "title": "Founder, Oliberté Footwear",
    "person_link": "http://www.fastcompany.com/person/tal-dehtiar",
    "opinion": "It cannot turn 360 degrees. Imagine a world where you can turn your head all the way around – that would have been a better way to design a neck. It would change everything."
  },
  {
    "index": 8,
    "product": "Metal-latched Mason jars",
    "img_name": "mason_jars",
    "love": "TRUE",
    "expert": "Leslie Bradshaw",
    "title": "Chief Operating Officer, Guide",
    "person_link": "http://www.fastcompany.com/person/leslie-bradshaw",
    "opinion": "There is such a sense of satisfaction when you pop open the top, and an equal sense of ‘my contents are safely sealed’ when you latch it back down. To think this was patented back in 1858!"
  },
  {
    "index": 9,
    "product": "Land line phone",
    "img_name": "land_line",
    "love": "TRUE",
    "expert": "Dan Heath",
    "title": "Author, Duke",
    "person_link": "http://www.fastcompany.com/person/dan-heath",
    "opinion": "It works every time, never drops calls, and has amazing sound quality. Shouldn’t corded phones be rebranded as luxury products that offer an ‘intimate audio experience’? Or does that sound phone-sex-ish?"
  },
  {
    "index": 10,
    "product": "Pizza",
    "img_name": "pizza",
    "love": "TRUE",
    "expert": "Neil Blumenthal",
    "title": "Cofounder, Warby Parker",
    "person_link": "http://www.fastcompany.com/person/neil-blumenthal",
    "opinion": "It’s edible, portable, foldable, and affordable. New York City’s subway map is all of the same things, except edible."
  },
  {
    "index": 11,
    "product": "Legos",
    "img_name": "lego",
    "love": "TRUE",
    "expert": "Dave Gilboa",
    "title": "Cofounder, Warby Parker",
    "person_link": "http://www.fastcompany.com/person/david-gilboa",
    "opinion": "They’re simple, fun, and can be used to build almost anything."
  },
  {
    "index": 12,
    "product": "Martini glasses",
    "img_name": "martini_glass",
    "love": "FALSE",
    "expert": "Dave Gilboa",
    "title": "Cofounder, Warby Parker",
    "person_link": "http://www.fastcompany.com/person/david-gilboa",
    "opinion": "These glasses are precision engineered—to make spilling inevitable."
  },
  {
    "index": 13,
    "product": "K–12 education",
    "img_name": "k_12",
    "love": "FALSE",
    "expert": "Bing Gordon",
    "title": "Partner, Kleiner Perkins Caufield & Byers",
    "person_link": "http://www.fastcompany.com/person/bing-gordon",
    "opinion": "It’s not tuned for personalized progression, and the feedback systems are way too slow, with insufficient social loops and group work."
  },
  {
    "index": 14,
    "product": "Infant car seats",
    "img_name": "car_seat",
    "love": "FALSE",
    "expert": "Julie Keefe",
    "title": "Creative Laureate, Portland, Oregon",
    "person_link": "http://www.fastcompany.com/person/julie-keefe",
    "opinion": "My guess is that there hasn’t been a design award given to any designer of infant car seats ever, ever in history."
  },
  {
    "index": 15,
    "product": "X-Acto knife",
    "img_name": "xacto",
    "love": "TRUE",
    "expert": "Rick Barrack",
    "title": "Chief Creative Officer, CBX",
    "person_link": "http://www.fastcompany.com/person/rick-barrack",
    "opinion": "I still have my very first one. It’s engineered perfectly, ergonomically sound, and can be used as just about anything: letter opener, nail clipper, presentation pointer, and of course board cutter."
  },
  {
    "index": 16,
    "product": "Pepto Bismol",
    "img_name": "pepto_bismol",
    "love": "FALSE",
    "expert": "Rick Barrack",
    "title": "Chief Creative Officer, CBX",
    "person_link": "http://www.fastcompany.com/person/rick-barrack",
    "opinion": "It’s a pink clay-like substance that has no appetite appeal. I get sick just thinking about it."
  },
  {
    "index": 17,
    "product": "The Getty Center",
    "img_name": "getty",
    "love": "TRUE",
    "expert": "Sarika Doshi",
    "title": "Cofounder, Rank & Style",
    "person_link": "http://www.fastcompany.com/person/sarika-doshi",
    "opinion": "It is the most pleasant, welcoming and inspiring space to experience art. It inspires to me think creatively, and to be present and thoughtful."
  },
  {
    "index": 18,
    "product": "London underground map",
    "img_name": "london_map",
    "love": "TRUE",
    "expert": "Krista Donaldson",
    "title": "CEO, D-Rev",
    "person_link": "http://www.fastcompany.com/person/krista-donaldson",
    "opinion": "It’s simple and elegantly clear."
  },
  {
    "index": 19,
    "product": "Pencil",
    "img_name": "pencil",
    "love": "TRUE",
    "expert": "D’Wayne Edwards",
    "title": "Founder, Pensole",
    "person_link": "http://www.fastcompany.com/person/dwayne-edwards",
    "opinion": "Invented in the 16th century, the pencil gave Pablo Picasso an image, Leonardo Da Vinci an object, Ludwig Van Beethovan sound and Charles Darwin a voice. It’s timeless."
  },
  {
    "index": 20,
    "product": "Tesla Model S",
    "img_name": "tesla_model_s",
    "love": "TRUE",
    "expert": "Dana Brunetti",
    "title": "Producer, Trigger Street",
    "person_link": "http://www.fastcompany.com/person/dana-brunetti",
    "opinion": "An all-electric vehicle that performs better than all of the gasoline powered cars I own and have owned, without the ugly looks of the hybrids. Truly a game changer."
  }
];


compileTemplate();
hideAllButFirst();
updateSocialLinks();

// HANDLERS
// =============================================
$('.viz-loathe, .viz-love').on('click', function() {
  var vars = getVars($(this));

  updateUnselected(vars);
  showAnswer(vars);
  removeHandlers(vars);
  toggleNext();
  updateSocialLinks();
});

nextBtn.on('click', function() {
  $('.viz-choice-item-visible').removeClass('viz-choice-item-visible').next().addClass('viz-choice-item-visible');
  toggleNext();
});

fbBtn.on('click', function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  popupCenter(url, 'Share', 555, 370);
});

twBtn.on('click', function(e) {
  e.preventDefault();
  var url = $(this).attr('href');
  popupCenter(url, 'Share', 555, 395);
});


// HELPERS
// =============================================

function hideAllButFirst() {
  $('.viz-choice-item').first().addClass('viz-choice-item-visible');
}

function compileTemplate() {
  var toAppendString = '';

  _.each(templateData, function(entity) {
    toAppendString += quizTemplate(entity);
  });

  $('.viz-choice-list').append(toAppendString);
}

function getVars($clicked) {
  var vars = {};

  var parentEl = $clicked.closest('.viz-choice-item');
  vars.loveLoathe = parentEl.find('.viz-love, .viz-loathe');
  vars.selectedEl = $clicked;
  vars.unselectedEl = vars.loveLoathe.not(vars.selectedEl);
  vars.rightEl = vars.loveLoathe.filter('[data-correct="true"]');
  vars.opinion = parentEl.find('.viz-opinion-wrap');
  vars.decision = vars.opinion.find('.viz-opinion-decision');

  return vars;
}

function updateUnselected(vars) {
  vars.unselectedEl.addClass('viz-unselected');
}

function showAnswer(vars) {
  vars.opinion.slideDown(200);

  if (vars.selectedEl[0] === vars.rightEl[0]) {
    vars.decision.text('agrees');
    incrementAgree();
  } else {
    vars.decision.text('disagrees');
    incrementDisagree();
  }
}

function incrementAgree() {
  var newCount = parseInt(agreeCount.text());
  agreeCount.text(newCount += 1);
}

function incrementDisagree() {
  var newCount = parseInt(disagreeCount.text());
  disagreeCount.text(newCount += 1);
}

function removeHandlers(vars) {
  vars.loveLoathe.off('click').addClass('viz-disabled');
}

function toggleNext() {
  nextBtn.toggleClass('viz-btn-show');
}

function updateSocialLinks() {
  var text = getUpdatedText();
  updateFb(text);
  updateTw(text);
}

function getUpdatedText() {
  return encodeURIComponent('I agreed with the experts ' + agreeCount.text() + ' times out of 20 on the @FastCompany Design Sense Quiz. Can you beat me?');
}

function updateFb(text) {
  var newURL = 'https://www.facebook.com/dialog/feed?link=' + encodeURIComponent(document.URL) + '&redirect_uri=' + document.URL + '&caption=' + text + '&name=' + encodeURIComponent($('.viz-hed').text()) + '&app_id=1468377633429250&display=popup&description=%26nbsp%3B';
  fbBtn.attr('href', newURL);
}

function updateTw(text) {
  var newURL = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(document.URL) + '&text='  + text + '&original_referer=http%3A%2F%2Fwww.fastcompany.com%2F';
  twBtn.attr('href', newURL);
}

function popupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  var ieFriendlyTitle = title.replace(/\s+/g, '');

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
  var newWindow = window.open(url, ieFriendlyTitle, 'scrollbars=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
}
