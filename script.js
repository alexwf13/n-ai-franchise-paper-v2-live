/* N Студия — антифраншиза · Paper v2 */
(function () {
  "use strict";

  /* ---------- Шапка: тень после скролла ---------- */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    header.classList.toggle("js-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Появление блоков при скролле ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    /* лёгкий каскад внутри одного родителя */
    revealEls.forEach(function (el) {
      var siblings = el.parentElement
        ? Array.prototype.filter.call(el.parentElement.children, function (c) {
            return c.hasAttribute("data-reveal");
          })
        : [el];
      var idx = siblings.indexOf(el);
      el.style.setProperty("--reveal-delay", Math.min(idx, 4) * 70 + "ms");
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Форма заявки: локальное success-состояние ---------- */
  var form = document.getElementById("lead-form");
  if (form) {
    var success = form.querySelector(".lead-form__success");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("js-tried");

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector("input:invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Бэкенда нет: фиксируем заявку локально (как в согласованном прототипе) */
      form.classList.add("js-sent");
      if (success) success.hidden = false;
      form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    });
  }

  /* ---------- Плавный скролл с учётом липкой шапки ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
