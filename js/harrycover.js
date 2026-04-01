$(function() {
  var words = [
    'Technicien Support N2',
    'Technicien Support de proximité',    
  ],
  i = 0;

  // On gère l'affichage du menu responsive pour les écrans inférieurs ou égaux à medium (< 992px)
  $(".navbar-responsive").hide();

  $(".menu-toggle").click(function (event) {
    event.preventDefault();
    $(".navbar-responsive").stop(true, true).slideToggle("slow");
  });

  $(window).on("resize", function() {
    if ($(window).width() >= 992) {
      $(".navbar-responsive").hide();
    }
  });

  var themeButtons = $(".theme-toggle");

  function applyTheme(theme) {
    var isDark = theme === "dark";

    $("body")
      .toggleClass("dark-mode", isDark)
      .toggleClass("light-mode", !isDark);

    themeButtons.each(function() {
      $(this)
        .text(isDark ? "☀️ Mode clair" : "🌙 Mode sombre")
        .attr("aria-label", isDark ? "Activer le mode clair" : "Activer le mode sombre");
    });
  }

  var savedTheme = localStorage.getItem("cv-theme");
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  themeButtons.click(function() {
    var nextTheme = $("body").hasClass("dark-mode") ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("cv-theme", nextTheme);
  });

  // On gère l'affichage aléatoire des phrases d'accroche du header (toutes les 3.5 secondes)
  setInterval(function() {
    $("#word").fadeOut(function() {
      $(this).html(words[i = (i + 1) % words.length]).fadeIn();
    });
  }, 3500);

  // On gère le scroll vers les différentes sections du site
  $(".scroll").click(function(event) {
    event.preventDefault();
    var section = $("." + this.id);

    if ($(window).width() < 992) {
      $(".navbar-responsive").stop(true, true).slideUp("slow");
    }

    if (section.length) {
      $("html,body").animate({scrollTop: section.offset().top}, 'slow');
    }
  });

  // On gère l'affichage des progressbar pour les compétences
  window.sr = ScrollReveal();
  sr.reveal('.progress-bar', {
    origin: 'left',
    duration: 2000,
    distance: '100%'
  })
});
