export default {
  beforeMount(el, binding) {
    let iconClass = `fa fa-${binding.value} text-xl`;

    // use binding argument to specify if it should fully-replace or modify
    if (binding.arg === "full") {
      iconClass = binding.value;
    }

    // binding modifiers
    if (binding.modifiers.right) {
      iconClass += " float-right";
    }

    if (binding.modifiers.yellow) {
      iconClass += " text-yellow-400";
    } else {
      iconClass += " text-green-400";
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class="${iconClass}"></i>`;
  },
};
