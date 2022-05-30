<?php

class Command
{
	private $name, $return;

	public function __construct(array $usage = [])
	{
		global $args;
		global $command;
		global $return;
		$this->name = $command;
		$this->return = &$return;
		if (!count($args) && $usage) {
			$this->usage($usage);
		}
	}

	public function output($output, $banner = false)
	{
		$this->return .= $banner ? $this->banner($output) : $output;
	}

	public function script($code)
	{
		echo "<script>$code</script>";
	}

	public function usage($instructions)
	{
		if (is_array($instructions) && count($instructions)) {
			$this->return .= $this->banner("usage");
			foreach ($instructions as $arg => $instruction) {
				$this->return .= "\n$arg: $instruction";
			}
		}
		return false;
	}

	public function banner(string $title)
	{
		return "=============[" . strtoupper($title) . "]================";
	}

	public function list(array $items, string $title = null)
	{
		if (count($items)) {
			if ($title) {
				$this->return .= $this->banner($title);
			}
			foreach ($items as $item) {
				$this->return .= "\n$item";
			}
			$this->return .= "\n";
		}
		return false;
	}

	public function grid(array $items, string $title = null)
	{
		global $escape;
		$escape = false;
		if (count($items)) {
			if ($title) {
				$this->return .= $this->banner($title);
			}
			$this->return .= "<div class='shortlist'>";
			foreach ($items as $item) {
				$this->return .= "<div>$item</div>";
			}
			$this->return .= "</div>";
		}
		return false;
	}

	public function table(array $items, string $title = null)
	{
		global $escape;
		$escape = false;
		if (count($items)) {
			$this->return .= '<table>';
			if ($title) {
				$this->return .= '<thead><tr><td>$title</td></tr></thead>';
			}
			$this->return .= '<tbody>';
			foreach ($items as $key => $value) {
				if (is_array($value)) {
					$value = print_r($value, true);
				}
				$this->return .= "<tr><td>$key</td><td>$value</td></tr>";
			}
			$this->return .= '</tbody></table>';
		}
		return false;
	}
}