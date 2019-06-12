<link rel="stylesheet" href="css/km-multiselect.1.0.0.css">
<div>
    <select id="newSelectBox" multiple>
        <option value="">Sel</option>
        <option value="1" selected="selected">OP Japan 1</option>
        <option value="2">OP Nepal 2</option>
        <option value="3">OP India 3</option>
        <option value="4" selected="selected">OP USA 4</option>
        <option value="5">OP UsSA 4</option>
        <option value="6">OPf USA 4</option>
        <option value="7">OP dUSA 4</option>
        <option value="8">OP USA 4</option>
        <option value="9">OP USaA 4</option>
        <option value="10">OP UaSA 4</option>
        <option value="11">OdP dfUdSA 4</option>
        <option value="12">OdfP UfdSA 4</option>
        <option value="13">OsP USdfA 4</option>
        <option value="14">OdfP fddUSA 4</option>
        <option value="15">fdfOP fdUdfSA 4</option>
        <option value="16">OfdP USadfA 4sd</option>
    </select>
</div>
<div>
    <select id="ajaxwala">
        <option value="">--Select--</option>
    </select>
</div>

<div>
    <select id="dependent">
        <option value="">--Select--</option>
    </select>
</div>

<div>
    <select id="dependent2">
        <option value="">--Select--</option>
    </select>
</div>

<script src="https://code.jquery.com/jquery-1.12.4.js"></script>
<script src="js/km-multiselect-1.0.0.js"></script>
<script>
  jQuery('#newSelectBox').kmMultiselect({search: true, multiple: true});
  jQuery('#ajaxwala').kmMultiselect({
    search: true,
    multiple: true,
    url: 'http://localhost/json/multiselect/data.php'
  });
  jQuery('#dependent').kmMultiselect({
    search: true,
    multiple: true,
    url: 'http://localhost/json/multiselect/data.php',
    dependent: [
      {
        key: 'dep1',
        selector: '#dependent2'
      }
    ]
  });
</script>