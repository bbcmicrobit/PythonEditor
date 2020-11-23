var BLOCKS_TOOLBOX = "<xml id=\"blockly-toolbox\" style=\"display: none\">\n" +
        "<category name=\"Accelerometer\" colour=\"0\">\n" +
        "  <block type=\"microbit_accelerometer_get_x\"></block>\n" +
        "  <block type=\"microbit_accelerometer_get_y\"></block>\n" +
        "  <block type=\"microbit_accelerometer_get_z\"></block>\n" +
        "  <block type=\"microbit_accelerometer_was_gesture\"></block>\n" +
        "  <block type=\"microbit_accelerometer_is_gesture\"></block>\n" +
        "  <block type=\"microbit_accelerometer_get_gestures\"></block>\n" +
        "  <block type=\"microbit_accelerometer_current_gesture\"></block>\n" +
        "</category>\n" +
        "<category name=\"Buttons\" colour=\"32\">\n" +
        "  <block type=\"microbit_button_is_pressed\"></block>\n" +
        "  <block type=\"microbit_button_was_pressed\"></block>\n" +
        "  <block type=\"microbit_button_get_presses\"></block>\n" +
        "</category>\n" +
        "<category name=\"Compass\" colour=\"64\">\n" +
        "  <block type=\"microbit_compass_calibrate\"></block>\n" +
        "  <block type=\"microbit_compass_is_calibrated\"></block>\n" +
        "  <block type=\"microbit_compass_heading\"></block>\n" +
        "  <block type=\"microbit_compass_get_field_strength\"></block>\n" +
        "</category>\n" +
        "<category name=\"Display\" colour=\"96\">\n" +
        "  <block type=\"microbit_display_get_pixel\"><value name=\"x\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"y\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value></block>\n" +
        "  <block type=\"microbit_display_set_pixel\"><value name=\"x\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"y\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"value\"><shadow type=\"math_number\"><field name=\"NUM\">9</field></shadow></value></block>\n" +
        "  <block type=\"microbit_display_clear\"></block>\n" +
        "  <block type=\"microbit_display_show_image\"></block>\n" +
        "  <block type=\"microbit_display_show_animation\"></block>\n" +
        "  <block type=\"microbit_display_scroll\"><value name=\"message\"><shadow type=\"text\"><field name=\"TEXT\">Hello, World!</field></shadow></value></block>\n" +
        "  <block type=\"microbit_display_on\"></block>\n" +
        "  <block type=\"microbit_display_off\"></block>\n" +
        "  <block type=\"microbit_display_is_on\"></block>\n" +
        "</category>\n" +
        "<category name=\"Image\" colour=\"128\">\n" +
        "  <block type=\"microbit_image_builtins\"></block>\n" +
        "  <block type=\"microbit_image_copy\"></block>\n" +
        "  <block type=\"microbit_image_invert\"></block>\n" +
        "  <block type=\"microbit_image_create\"></block>\n" +
        "</category>\n" +
        "<category name=\"Microbit\" colour=\"160\">\n" +
        "  <block type=\"microbit_microbit_panic\"></block>\n" +
        "  <block type=\"microbit_microbit_reset\"></block>\n" +
        "  <block type=\"microbit_microbit_sleep\"><value name=\"duration\"><shadow type=\"math_number\"><field name=\"NUM\">1000</field></shadow></value></block>\n" +
        "  <block type=\"microbit_microbit_running_time\"></block>\n" +
        "  <block type=\"microbit_microbit_temperature\"></block>\n" +
        "</category>\n" +
        "<category name=\"Music\" colour=\"192\">\n" +
        "  <block type=\"microbit_music_play_built_in\"></block>\n" +
        "  <block type=\"microbit_music_pitch\"></block>\n" +
        "  <block type=\"microbit_music_play_list_of_notes\"></block>\n" +
        "  <block type=\"microbit_music_reset\"></block>\n" +
        "  <block type=\"microbit_music_stop\"></block>\n" +
        "  <block type=\"microbit_music_set_tempo\"><value name=\"ticks\"><shadow type=\"math_number\"><field name=\"NUM\">4</field></shadow></value><value name=\"bpm\"><shadow type=\"math_number\"><field name=\"NUM\">120</field></shadow></value></block>\n" +
        "  <block type=\"microbit_music_get_tempo\"></block>\n" +
        "</category>\n" +
        "<category name=\"Neopixel\" colour=\"224\">\n" +
        "  <block type=\"microbit_neopixel_initialise\"></block>\n" +
        "  <block type=\"microbit_neopixel_clear\"></block>\n" +
        "  <block type=\"microbit_neopixel_show\"></block>\n" +
        "  <block type=\"microbit_neopixel_set\"><value name=\"pixel\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"red\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"green\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value><value name=\"blue\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value></block>\n" +
        "</category>\n" +
        "<category name=\"Pins\" colour=\"256\">\n" +
        "  <block type=\"microbit_pin_touched\"></block>\n" +
        "  <block type=\"microbit_pin_read_analog\"></block>\n" +
        "  <block type=\"microbit_pin_write_analog\"><value name=\"output\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value></block>\n" +
        "  <block type=\"microbit_pin_read_digital\"></block>\n" +
        "  <block type=\"microbit_pin_write_digital\"><value name=\"output\"><shadow type=\"math_number\"><field name=\"NUM\">0</field></shadow></value></block>\n" +
        "</category>\n" +
        "<category name=\"Radio\" colour=\"288\">\n" +
        "  <block type=\"microbit_radio_on\"></block>\n" +
        "  <block type=\"microbit_radio_off\"></block>\n" +
        "  <block type=\"microbit_radio_config\"></block>\n" +
        "  <block type=\"microbit_radio_reset\"></block>\n" +
        "  <block type=\"microbit_radio_send_string\"><value name=\"message\"><shadow type=\"text\"><field name=\"TEXT\">Some text</field></shadow></value></block>\n" +
        "  <block type=\"microbit_radio_receive\"></block>\n" +
        "</category>\n" +
        "<category name=\"Speech\" colour=\"320\">\n" +
        "  <block type=\"microbit_speech_say\"><value name=\"english\"><shadow type=\"text\"><field name=\"TEXT\">Exterminate!</field></shadow></value></block>\n" +
        "  <block type=\"microbit_speech_pronounce\"><value name=\"phonemes\"><shadow type=\"text\"><field name=\"TEXT\">/HEH5EH4EH3EH2EH2EH3EH4EH5EHLP.</field></shadow></value></block>\n" +
        "  <block type=\"microbit_speech_sing\"><value name=\"song\"><shadow type=\"text\"><field name=\"TEXT\">#115DOWWWW</field></shadow></value></block>\n" +
        "</category>\n" +
        "<sep></sep>\n" +
        "<category name=\"Logic\" colour=\"210\">\n" +
        "  <block type=\"controls_if\"></block>\n" +
        "  <block type=\"logic_compare\"></block>\n" +
        "  <block type=\"logic_operation\"></block>\n" +
        "  <block type=\"logic_negate\"></block>\n" +
        "  <block type=\"logic_boolean\"></block>\n" +
        "  <block type=\"logic_null\"></block>\n" +
        "  <block type=\"logic_ternary\"></block>\n" +
        "</category>\n" +
        "<category name=\"Loops\" colour=\"120\">\n" +
        "  <block type=\"controls_repeat_ext\">\n" +
        "<value name=\"TIMES\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">10</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"controls_whileUntil\"></block>\n" +
        "  <block type=\"controls_for\">\n" +
        "<value name=\"FROM\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"TO\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">10</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"BY\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"controls_forEach\"></block>\n" +
        "  <block type=\"controls_flow_statements\"></block>\n" +
        "</category>\n" +
        "<category name=\"Math\" colour=\"230\">\n" +
        "  <block type=\"math_number\" gap=\"32\"></block>\n" +
        "  <block type=\"math_arithmetic\">\n" +
        "<value name=\"A\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"B\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_single\">\n" +
        "<value name=\"NUM\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">9</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_trig\">\n" +
        "<value name=\"NUM\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">45</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_constant\"></block>\n" +
        "  <block type=\"math_number_property\">\n" +
        "  <value name=\"NUMBER_TO_CHECK\">\n" +
        "  <shadow type=\"math_number\">\n" +
        "<field name=\"NUM\">0</field>\n" +
        "  </shadow>\n" +
        "  </value>\n" +
        "  </block>\n" +
        "  <block type=\"math_round\">\n" +
        "<value name=\"NUM\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">3.1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_on_list\"></block>\n" +
        "  <block type=\"math_modulo\">\n" +
        "<value name=\"DIVIDEND\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">64</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"DIVISOR\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">10</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_constrain\">\n" +
        "<value name=\"VALUE\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">50</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"LOW\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"HIGH\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">100</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_random_int\">\n" +
        "<value name=\"FROM\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">1</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "<value name=\"TO\">\n" +
        "<shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">100</field>\n" +
        "</shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"math_random_float\"></block>\n" +
        "</category>\n" +
        "<category name=\"Text\" colour=\"160\">\n" +
        "  <block type=\"text\"></block>\n" +
        "  <block type=\"text_join\"></block>\n" +
        "  <block type=\"text_append\">\n" +
        "<value name=\"TEXT\">\n" +
        "  <shadow type=\"text\"></shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_length\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">abc</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_isEmpty\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\"></field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_indexOf\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">text</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "<value name=\"FIND\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">abc</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_charAt\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">text</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_getSubstring\">\n" +
        "<value name=\"STRING\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">text</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_changeCase\">\n" +
        "<value name=\"TEXT\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">abc</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_trim\">\n" +
        "<value name=\"TEXT\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">abc</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"text_print\">\n" +
        "<value name=\"TEXT\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">abc</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "</category>\n" +
        "<category name=\"Lists\" colour=\"260\">\n" +
        "  <block type=\"lists_create_with\">\n" +
        "<mutation items=\"0\"></mutation>\n" +
        "  </block>\n" +
        "  <block type=\"lists_create_with\"></block>\n" +
        "  <block type=\"lists_repeat\">\n" +
        "<value name=\"NUM\">\n" +
        "  <shadow type=\"math_number\">\n" +
        "  <field name=\"NUM\">5</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_length\"></block>\n" +
        "  <block type=\"lists_isEmpty\"></block>\n" +
        "  <block type=\"lists_indexOf\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">list</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_getIndex\">\n" +
        "<value name=\"VALUE\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">list</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_setIndex\">\n" +
        "<value name=\"LIST\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">list</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_getSublist\">\n" +
        "<value name=\"LIST\">\n" +
        "  <block type=\"variables_get\">\n" +
        "  <field name=\"VAR\">list</field>\n" +
        "  </block>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_split\">\n" +
        "<value name=\"DELIM\">\n" +
        "  <shadow type=\"text\">\n" +
        "  <field name=\"TEXT\">,</field>\n" +
        "  </shadow>\n" +
        "</value>\n" +
        "  </block>\n" +
        "  <block type=\"lists_sort\"></block>\n" +
        "</category>\n" +
        "<sep></sep>\n" +
        "<category name=\"Variables\" colour=\"330\" custom=\"VARIABLE\"></category>\n" +
        "</xml>\n";
