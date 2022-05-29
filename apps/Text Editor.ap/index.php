<div class="app-toolbar">
	<span id="file">
		<button type="submit" onclick="save();">Save</button>
	</span>
	<span id="formatting">
		<button type="submit" onclick="format('bold')">B</button>
		<button type="submit" onclick="format('italic')"><i>I</i></button>
		<button type="submit" onclick="format('underline')"><u>U</u></button>
		<!-- <button type="submit" onclick="format('CreateLink')">Link</button> -->
		<select onchange="document.execCommand('fontName',false,this.value);">
			<option value="Arial">Arial</option>
			<option value="Helvetica" selected>Helvetica</option>
			<option value="Monaco">Monaco</option>
			<option value="Impact">Impact</option>
			<option value="Times">Times</option>
		</select>
		<select onchange="document.execCommand('fontSize',false,this.value);">
			<?php
			$sizes = array(
				1 => "Extra Small",
				2 => "Small",
				3 => "Regular",
				4 => "Large",
				5 => "Extra Large",
				6 => "XX Large",
				7 => "XXX Large"
			);
			foreach ($sizes as $i => $label) {
				unset($selected);
				if ($i === 3) $selected = "selected";
				echo "<option value='$i' $selected>$label</option>";
			}
			?>
		</select>
	</span>
</div>
<?php if ($_GET['path']): ?>
	<textarea class="contents" style="font-family:monospace;font-size:14px;"></textarea>
<?php else: ?>
	<div class="contents" contenteditable="true" style="font-family: Helvetica;font-size: 14;"></div>
<?php endif; ?>