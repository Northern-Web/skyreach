// Toggle Signup button
$('#tosOptin').on('change', function() {
    $('#btnSignUp').prop('disabled', !$(this).prop('checked'));
  });