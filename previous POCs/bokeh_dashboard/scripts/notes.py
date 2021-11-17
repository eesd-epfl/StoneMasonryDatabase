# Test callback functions that aren't working:
# 1. This one should be pretty close to working:
# # Widget Callback code:
# widget_callback_code = """
# var filtered_data = filtered_source.get('data');
# var original_data = original_source.get('data');
#
# var strength_slider = strength_slider.get('value');
#
# // now construct the new data object based on the filtered values
# for (var key in original_data) {
#     filtered_data[key] = [];
#     for (var i = 0; i < original_data[key].length; ++i) {
#         if (original_data["Keff,+ [kN/mm]"][i] >= strength_slider) {
#             filtered_data[key].push(original_data[key][i]);
#         }
#     }
# }
# source.data = filtered_data
# """
#
# # Dictionary with all the required data for callback:
# arg_dct = dict(
#     filtered_source=source,
#     original_source=original_source,
#     strength_slider=strength_slider,
#     target_obj=data_table
# )
# generic_callback = CustomJS(args=arg_dct, code=widget_callback_code)
#
# # Slider interactivity on change:
# stiffness_slider.js_on_change('value', generic_callback)


# 2. - Not working
# requires (source, original_source, country_select_obj, year_select_obj, target_object)
# callback_code = """
# var data = source.data;
# var original_data = original_source.data;
# var new_source= []
# active_typologies = [typology_checkbox_obj.labels[i] for i in typology_checkbox_obj.active]
# id = source.data['ID']
# for (var i=0; i < id.length; i++) {
#     for (item in active_typologies){
#         if(item==data['Stone masonry typology'][i]){
#             new_source[i]=data[i]
#         }
#     }
# }
# source.change.emit();
# target_obj.change.emit();
# target_obj.trigger('change');
# """

# combined_callback_code = """
# var data = source.data;
# var original_data = original_source.data;
# var typology = typology_checkbox_obj.value;
# console.log("Typology: " + typology);
# for (var key in original_data) {
#
#     data[key] = [];
#     for (var i = 0; i < original_data['Stone masonry typology'].length; ++i) {
#         if ((typology === "ALL" || original_data['Stone masonry typology'][i] === typology)) {
#             data[key].push(original_data[key][i]);
#         }
#     }
# }
# source.change.emit();
# target_obj.change.emit();
# target_obj.trigger('change')
# """

# now define the callback objects now that the filter widgets exist
# checkbox_callback = CustomJS(
#     args=dict(source=source,
#               original_source=original_source,
#               typology_checkbox_obj=typology_checkbox,
#               target_obj=data_table,
#               ),
#     code=callback_code
# )
# Connect callback to filter widget
# typology_checkbox.on_change('active', checkbox_callback)
# show(typology_checkbox)

#######################################################################################################################
