# Test callback functions that aren't working:

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
