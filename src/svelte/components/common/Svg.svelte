<script>
   // Components
   // Stores
   // Properties
   export let fileData = '';

   // Methods
   const stringToElement = (html) => {
      let template = document.createElement('template');
      html = html.trim(); // Never return a text node of whitespace as the result
      template.innerHTML = html;
      return template.content.firstChild;
   };

   // Constants
   const element = stringToElement(fileData);

   if ($$props.title) {
      const titleEle = document.createElement('title');
      titleEle.innerHTML = $$props.title;
      element.prepend(titleEle);
   }

   const svgProps = Object.keys(element.attributes).reduce((obj, nth) => {
      const { name, nodeValue } = element.attributes[nth];
      obj[name] = nodeValue;
      return obj;
   }, {});

   // Variables
   let externalProps;

   // Subscriptions
   // Contexts
   // Reactive Rules

   $: if ($$props) {
      externalProps = { ...$$props };
      delete externalProps.fileData;
   }

   $: props = { ...svgProps, ...externalProps };

   // Events
   // Lifecycle
</script>

<svg on:click {...props}>{@html element.innerHTML}</svg>

<style>
</style>
