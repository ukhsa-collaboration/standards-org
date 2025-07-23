---
layout: page
eleventyExcludeFromCollections: true
---
# Debug Navigation

## Navigation Debug

Navigation key for this page: {{ eleventyNavigation.key }}

Collections.navigation items:
{% for item in collections.navigation %}

- {{ item.data.title }}
  - sectionKey: {{ item.data.sectionKey }}
  - key: {{ item.data.eleventyNavigation.key }}
  - parent: {{ item.data.eleventyNavigation.parent }}
  - title: {{ item.data.eleventyNavigation.title }}
  - slug: {{ item.data.page.fileSlug }}

```json
{{ item.data.page | dump(2) }}
```

{% endfor %}

Collections.all navigation items:
{% for item in collections.all %}
{% if item.data.eleventyNavigation.key %}

- {{ item.data.title }}
  - sectionKey: {{ item.data.sectionKey }}
  - key: {{ item.data.eleventyNavigation.key }}
  - parent: {{ item.data.eleventyNavigation.parent }}
{% endif %}
{% endfor %}
