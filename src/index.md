---
layout: home.njk
title: Home
weight: 100
---
 
{% include "identity.njk" %}
<div id="main-contents">
  {% pageList collections.pages, "", true, true %}
  {% include "about.njk" %}
</div>

<footer>
{% include "copyright.njk" %}
</footer>
