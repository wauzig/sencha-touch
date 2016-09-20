/**
 * This class uses the TinyMCE editor.
 * 
 * @author wauzig <jintern@gmx.at>
 * @version 1.0.0
 * @see Please check the {@link http://www.tinymce.com|TinyMCE} homepage for license agreements!
 * @todo At the moment there is no possibility to use more than one TinyMCE editor instance on same page. I tried it with Ext.Component and TinyMCE inline mode but the result was unsatisfying!
 */
Ext.define('Ext.ux.field.TinyMCE',{
	extend: 'Ext.field.TextAreaInput',
	alias: 'widget.tinymce',
	requires: [
		'Ext.MessageBox'
	],
	/**
	 * This property may be used to configure TinyMCE plugins,...
	 * @example
	 * ...
	 * ,{
	 *     xtype: 'tinymce',
	 *     tinymceConfig: {
	 *         plugins: 'contextmenu image link table preview',
	 *         contextmenu: 'link image | inserttable tableprops deletetable | cell row column'
	 *     }
	 * },
	 * ...
	 * </caption>
	 * @member {Object}
	 */
	tinymceConfig: null,
	/**
	 * Get the TinyMCE editor id.
	 * This is the same as the Sencha Touch textarea element id!
	 * 
	 * @returns {string} The TinyMCE editor id
	 */
	getEditorId: function() {
		var me = this;
		return me.element.query('textarea')[0].id;
	},
	/**
	 * Get the TinyMCE editor instance.
	 * 
	 * @returns {tinymce.Editor} The TinyMCE editor instance
	 */
	getEditor: function() {
		var me = this;
		var editor = null;
		if (typeof(tinymce) !== 'undefined') editor = tinymce.get(me.getEditorId());
		if (!editor) Ext.Logger.warn('try to get TinyMCE editor (' + me.getId() + ') but TinyMCE not loaded or editor not initialized!');
		return editor;
	},
	/**
	 * Get the TinyMCE editor content.
	 * @example 
	 * var myContent = myEditor.getValue({
	 *     format: 'raw'
	 * })
	 * @override
	 * @param {Object} args Optional content object, this gets passed around through the whole get process.
	 * @returns {string} Cleaned content string, normally HTML contents.
	 */
	getValue: function(args) {
		var me = this;
		var editor = me.getEditor();
		if (editor) return editor.getContent(args || null);
		else return null;
	},
	/**
	 * Set the TinyMCE editor content.
	 * @example
	 * myEditor.setValue(myContent,{
	 *     format: 'raw'
	 * });
	 * @override
	 * @param {string} value Content to set to editor, normally HTML contents but can be other formats as well.
	 * @param {Object} args  Optional content object, this gets passed around through the whole set process.
	 */
	setValue: function(value, args) {
		var me = this;
		var editor = me.getEditor();
		if (editor) editor.setContent(value, args || null);
		else Ext.Logger.warn('try to set TinyMCE editor (' + me.getId() + ') content but TinyMCE not loaded or editor not initialized!');
	},
	/**
	 * On initialization of the Sencha Touch component we decide if TinyMCE javascript must be loaded and/or initialze TinyMCE editor instance.
	 * @constructs
	 */
	initialize: function() {
		var me = this;
		me.callParent(arguments);

		if (typeof(tinymce) == 'undefined') {
			Ext.Viewport.setMasked({
				xtype: 'loadmask',
				message: 'Loading TinyMCE...'
			});

			document.head.appendChild(Ext.Element.create({
				tag: 'script',
				src: '//cdn.tinymce.com/4/tinymce.min.js',
				onload: 'Ext.getCmp(\'' + me.getId() + '\').initTinyMCE(true);',
				onerror: 'Ext.getCmp(\'' + me.getId() + '\').initTinyMCE(false);'
			}).dom);
		}
		else {
			initTinyMCE(true);
		}
	},
	/**
	 * Callback to initialize TinyMCE editor instance.
	 * @param {boolean} success will be true if TinyMCE could be loaded or is already loaded, false otherwise
	 */
	initTinyMCE: function(success) {
		var me = this;

		Ext.Viewport.setMasked(false);

		if (success) {
			tinymce.init(Ext.applyIf({
				selector: '#' + me.getEditorId()
			},me.tinymceConfig));
		}
		else {
			Ext.Msg.alert('TinyMCE Error','Could not load TinyMCE editor!');
		}
	}
});

