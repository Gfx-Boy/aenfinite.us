/**
 * form-validation.js — Aenfinite Form Validation Utilities
 * Used by intro/demo pages. Core validation logic is in /js/custom-form-handler.js
 */
(function () {
  'use strict';

  window.AenfiniteValidation = {
    /** Email regex check */
    isValidEmail: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).toLowerCase());
    },
    /** Non-empty string check */
    isNonEmpty: function (val) {
      return typeof val === 'string' && val.trim().length > 0;
    },
    /** Minimum length check */
    minLength: function (val, min) {
      return typeof val === 'string' && val.trim().length >= min;
    },
    /** Sanitize text to prevent XSS display */
    sanitize: function (str) {
      const d = document.createElement('div');
      d.appendChild(document.createTextNode(str));
      return d.innerHTML;
    }
  };
})();
